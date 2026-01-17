"""
Google Analytics Data API Backend Service
Fetches analytics metrics from GA4 for the admin dashboard
"""

import os
import json
import tempfile
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel

# Load environment variables
load_dotenv()

# Configuration
GA_PROPERTY_ID = os.getenv("GA_PROPERTY_ID")

# Handle Google credentials from environment variable (for cloud deployment)
def setup_credentials():
    """
    Set up Google credentials from environment variable.
    Supports both file path (local) and JSON string (cloud deployment).
    """
    # Check if credentials JSON is provided directly as env var
    creds_json = os.getenv("GOOGLE_CREDENTIALS_JSON")
    if creds_json:
        try:
            # Write to temp file and set the path
            creds_data = json.loads(creds_json)
            temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False)
            json.dump(creds_data, temp_file)
            temp_file.close()
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = temp_file.name
            return True
        except json.JSONDecodeError as e:
            print(f"Warning: Failed to parse GOOGLE_CREDENTIALS_JSON: {e}")
            return False
    return False

# Try to set up credentials from JSON env var
setup_credentials()

# Initialize FastAPI app
app = FastAPI(
    title="GA4 Analytics API",
    description="Backend service for fetching Google Analytics data",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ Lazy Client Initialization ============

_client = None
_realtime_client = None

def get_ga_client():
    """Lazy initialization of GA4 Data API client."""
    global _client
    if _client is None:
        try:
            from google.analytics.data_v1beta import BetaAnalyticsDataClient
            _client = BetaAnalyticsDataClient()
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Failed to initialize GA4 client: {str(e)}"
            )
    return _client


# ============ Helper Functions ============

def get_date_range(days: int) -> tuple:
    """Calculate start and end dates for the given number of days."""
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    return start_date.strftime("%Y-%m-%d"), end_date.strftime("%Y-%m-%d")


def run_report(
    dimensions: List[str],
    metrics: List[str],
    days: int,
    dimension_filter = None,
    order_bys = None,
    limit: int = 100
) -> List[Dict[str, Any]]:
    """
    Generic function to run a GA4 report.
    Returns list of rows with dimension and metric values.
    """
    from google.analytics.data_v1beta.types import (
        RunReportRequest,
        DateRange,
        Dimension,
        Metric,
        OrderBy,
    )
    
    if not GA_PROPERTY_ID:
        raise HTTPException(status_code=500, detail="GA_PROPERTY_ID not configured")
    
    client = get_ga_client()
    start_date, end_date = get_date_range(days)
    
    request_params = {
        "property": f"properties/{GA_PROPERTY_ID}",
        "date_ranges": [DateRange(start_date=start_date, end_date=end_date)],
        "dimensions": [Dimension(name=d) for d in dimensions] if dimensions else [],
        "metrics": [Metric(name=m) for m in metrics],
        "limit": limit,
    }
    
    if dimension_filter:
        request_params["dimension_filter"] = dimension_filter
    
    if order_bys:
        request_params["order_bys"] = order_bys
    
    try:
        request = RunReportRequest(**request_params)
        response = client.run_report(request)
        
        results = []
        for row in response.rows:
            row_data = {}
            for i, dim in enumerate(dimensions):
                row_data[dim] = row.dimension_values[i].value
            for i, met in enumerate(metrics):
                value = row.metric_values[i].value
                # Try to convert to number
                try:
                    row_data[met] = float(value) if '.' in value else int(value)
                except:
                    row_data[met] = value
            results.append(row_data)
        
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GA4 API error: {str(e)}")


def run_aggregate_report(metrics: List[str], days: int, exclude_admin: bool = True) -> Dict[str, Any]:
    """Run a report without dimensions to get aggregate totals."""
    from google.analytics.data_v1beta.types import (
        RunReportRequest,
        DateRange,
        Metric,
        FilterExpression,
        FilterExpressionList,
        Filter,
    )
    
    if not GA_PROPERTY_ID:
        raise HTTPException(status_code=500, detail="GA_PROPERTY_ID not configured")
    
    client = get_ga_client()
    start_date, end_date = get_date_range(days)
    
    request_params = {
        "property": f"properties/{GA_PROPERTY_ID}",
        "date_ranges": [DateRange(start_date=start_date, end_date=end_date)],
        "metrics": [Metric(name=m) for m in metrics],
    }
    
    # Add filter to exclude admin and login pages
    if exclude_admin:
        request_params["dimension_filter"] = FilterExpression(
            not_expression=FilterExpression(
                or_group=FilterExpressionList(
                    expressions=[
                        FilterExpression(
                            filter=Filter(
                                field_name="pagePath",
                                string_filter=Filter.StringFilter(
                                    match_type=Filter.StringFilter.MatchType.BEGINS_WITH,
                                    value="/admin"
                                )
                            )
                        ),
                        FilterExpression(
                            filter=Filter(
                                field_name="pagePath",
                                string_filter=Filter.StringFilter(
                                    match_type=Filter.StringFilter.MatchType.BEGINS_WITH,
                                    value="/login"
                                )
                            )
                        ),
                    ]
                )
            )
        )
    
    try:
        request = RunReportRequest(**request_params)
        response = client.run_report(request)
        
        result = {}
        if response.rows:
            for i, met in enumerate(metrics):
                value = response.rows[0].metric_values[i].value
                try:
                    result[met] = float(value) if '.' in value else int(value)
                except:
                    result[met] = value
        else:
            for met in metrics:
                result[met] = 0
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GA4 API error: {str(e)}")


# ============ Response Models ============

class StatsResponse(BaseModel):
    visitors: int
    pageviews: int
    bounceRate: float
    avgSessionDuration: float
    sessions: int
    period: str


class TimeSeriesPoint(BaseModel):
    x: str
    y: int


class PageviewsSeriesResponse(BaseModel):
    pageviews: List[TimeSeriesPoint]
    sessions: List[TimeSeriesPoint]
    period: str


class MetricItem(BaseModel):
    x: str
    y: int


# ============ API Endpoints ============

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "service": "GA4 Analytics API", "version": "1.0.0"}


@app.get("/api/stats", response_model=StatsResponse)
async def get_stats(days: int = Query(default=7, ge=1, le=365)):
    """
    Get main stats: visitors, pageviews, bounce rate, avg session duration.
    """
    metrics = [
        "activeUsers",
        "screenPageViews", 
        "bounceRate",
        "averageSessionDuration",
        "sessions"
    ]
    
    result = run_aggregate_report(metrics, days)
    
    return {
        "visitors": result.get("activeUsers", 0),
        "pageviews": result.get("screenPageViews", 0),
        "bounceRate": round(result.get("bounceRate", 0) * 100, 2),  # Convert to percentage
        "avgSessionDuration": round(result.get("averageSessionDuration", 0), 1),
        "sessions": result.get("sessions", 0),
        "period": f"{days}d"
    }


@app.get("/api/leads")
async def get_leads(days: int = Query(default=28, ge=1, le=365)):
    """Get lead count (generate_lead events) for the specified period."""
    from google.analytics.data_v1beta.types import (
        FilterExpression,
        Filter,
    )
    
    dimension_filter = FilterExpression(
        filter=Filter(
            field_name="eventName",
            string_filter=Filter.StringFilter(
                match_type=Filter.StringFilter.MatchType.EXACT,
                value="generate_lead"
            )
        )
    )
    
    results = run_report(
        dimensions=["eventName"],
        metrics=["eventCount"],
        days=days,
        dimension_filter=dimension_filter
    )
    
    total_leads = sum(r.get("eventCount", 0) for r in results)
    
    return {"leads": total_leads, "period": f"{days}d"}


@app.get("/api/pageviews-series")
async def get_pageviews_series(days: int = Query(default=7, ge=1, le=365)):
    """Get time-series data for pageviews and sessions chart."""
    results = run_report(
        dimensions=["date"],
        metrics=["screenPageViews", "sessions"],
        days=days,
        limit=365
    )
    
    # Sort by date
    results.sort(key=lambda x: x.get("date", ""))
    
    pageviews = []
    sessions = []
    
    for r in results:
        date_str = r.get("date", "")
        # Format date from YYYYMMDD to YYYY-MM-DD
        if len(date_str) == 8:
            formatted_date = f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:8]}"
        else:
            formatted_date = date_str
        
        pageviews.append({"x": formatted_date, "y": r.get("screenPageViews", 0)})
        sessions.append({"x": formatted_date, "y": r.get("sessions", 0)})
    
    return {
        "pageviews": pageviews,
        "sessions": sessions,
        "period": f"{days}d"
    }


@app.get("/api/top-pages")
async def get_top_pages(days: int = Query(default=7, ge=1, le=365), limit: int = Query(default=10, le=50)):
    """Get top pages by pageviews."""
    from google.analytics.data_v1beta.types import OrderBy
    
    results = run_report(
        dimensions=["pagePath"],
        metrics=["screenPageViews", "activeUsers", "bounceRate", "averageSessionDuration"],
        days=days,
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="screenPageViews"), desc=True)],
        limit=limit
    )
    
    # Format for frontend compatibility
    pages = []
    for r in results:
        pages.append({
            "x": r.get("pagePath", "/"),
            "y": r.get("screenPageViews", 0),
            "visitors": r.get("activeUsers", 0),
            "bounceRate": round(r.get("bounceRate", 0) * 100, 1),
            "avgTime": round(r.get("averageSessionDuration", 0), 1)
        })
    
    return {"pages": pages, "period": f"{days}d"}


@app.get("/api/devices")
async def get_devices(days: int = Query(default=7, ge=1, le=365)):
    """Get device category breakdown."""
    results = run_report(
        dimensions=["deviceCategory"],
        metrics=["activeUsers"],
        days=days
    )
    
    devices = [{"x": r.get("deviceCategory", "unknown"), "y": r.get("activeUsers", 0)} for r in results]
    
    return {"devices": devices, "period": f"{days}d"}


@app.get("/api/channels")
async def get_channels(days: int = Query(default=7, ge=1, le=365)):
    """Get traffic channels breakdown."""
    results = run_report(
        dimensions=["sessionDefaultChannelGroup"],
        metrics=["sessions", "activeUsers"],
        days=days
    )
    
    channels = [
        {
            "x": r.get("sessionDefaultChannelGroup", "Direct"),
            "y": r.get("sessions", 0),
            "users": r.get("activeUsers", 0)
        } 
        for r in results
    ]
    
    return {"channels": channels, "period": f"{days}d"}


@app.get("/api/referrers")
async def get_referrers(days: int = Query(default=7, ge=1, le=365), limit: int = Query(default=15, le=50)):
    """Get referrer sources (filtered to remove debug/testing traffic)."""
    from google.analytics.data_v1beta.types import OrderBy
    
    # Debug/testing domains to filter out
    debug_domains = [
        'tagassistant.google.com',
        'gtm-msr.appspot.com',
        'localhost',
        '127.0.0.1',
    ]
    
    # Request more results to account for filtered entries
    results = run_report(
        dimensions=["sessionSource"],
        metrics=["sessions"],
        days=days,
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
        limit=limit + 10  # Extra buffer for filtering
    )
    
    # Filter out debug domains
    referrers = []
    for r in results:
        source = r.get("sessionSource", "(direct)")
        # Skip debug domains
        if any(debug in source.lower() for debug in debug_domains):
            continue
        referrers.append({"x": source, "y": r.get("sessions", 0)})
    
    # Apply original limit after filtering
    referrers = referrers[:limit]
    
    return {"referrers": referrers, "period": f"{days}d"}


@app.get("/api/countries")
async def get_countries(days: int = Query(default=7, ge=1, le=365), limit: int = Query(default=20, le=50)):
    """Get visitors by country."""
    from google.analytics.data_v1beta.types import OrderBy
    
    results = run_report(
        dimensions=["country"],
        metrics=["activeUsers"],
        days=days,
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="activeUsers"), desc=True)],
        limit=limit
    )
    
    countries = [{"x": r.get("country", "Unknown"), "y": r.get("activeUsers", 0)} for r in results]
    
    return {"countries": countries, "period": f"{days}d"}


@app.get("/api/cities")
async def get_cities(days: int = Query(default=7, ge=1, le=365), limit: int = Query(default=20, le=50)):
    """Get visitors by city with country info for flag display."""
    from google.analytics.data_v1beta.types import OrderBy
    
    results = run_report(
        dimensions=["city", "country"],
        metrics=["activeUsers"],
        days=days,
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="activeUsers"), desc=True)],
        limit=limit
    )
    
    cities = [{
        "city": r.get("city", "Unknown"),
        "country": r.get("country", "Unknown"),
        "visitors": r.get("activeUsers", 0)
    } for r in results]
    
    return {"cities": cities, "period": f"{days}d"}


@app.get("/api/browsers")
async def get_browsers(days: int = Query(default=7, ge=1, le=365)):
    """Get browser breakdown."""
    results = run_report(
        dimensions=["browser"],
        metrics=["activeUsers"],
        days=days
    )
    
    browsers = [{"x": r.get("browser", "Unknown"), "y": r.get("activeUsers", 0)} for r in results]
    
    return {"browsers": browsers, "period": f"{days}d"}


@app.get("/api/operating-systems")
async def get_operating_systems(days: int = Query(default=7, ge=1, le=365)):
    """Get operating system breakdown."""
    results = run_report(
        dimensions=["operatingSystem"],
        metrics=["activeUsers"],
        days=days
    )
    
    os_data = [{"x": r.get("operatingSystem", "Unknown"), "y": r.get("activeUsers", 0)} for r in results]
    
    return {"operatingSystems": os_data, "period": f"{days}d"}


@app.get("/api/realtime")
async def get_realtime():
    """
    Get comprehensive realtime data.
    Includes: active users, pages, cities, devices, events, and traffic sources.
    """
    from google.analytics.data_v1beta.types import (
        RunRealtimeReportRequest,
        Metric,
        Dimension,
    )
    
    if not GA_PROPERTY_ID:
        raise HTTPException(status_code=500, detail="GA_PROPERTY_ID not configured")
    
    client = get_ga_client()
    
    try:
        # Get total active users
        request = RunRealtimeReportRequest(
            property=f"properties/{GA_PROPERTY_ID}",
            metrics=[Metric(name="activeUsers")],
        )
        response = client.run_realtime_report(request)
        
        active_users = 0
        if response.rows:
            active_users = int(response.rows[0].metric_values[0].value)
        
        # Get active users by page
        request_pages = RunRealtimeReportRequest(
            property=f"properties/{GA_PROPERTY_ID}",
            dimensions=[Dimension(name="unifiedScreenName")],
            metrics=[Metric(name="activeUsers")],
        )
        response_pages = client.run_realtime_report(request_pages)
        
        pages = {}
        for row in response_pages.rows:
            page = row.dimension_values[0].value
            users = int(row.metric_values[0].value)
            pages[page] = users
        
        # Get active users by country
        request_countries = RunRealtimeReportRequest(
            property=f"properties/{GA_PROPERTY_ID}",
            dimensions=[Dimension(name="country")],
            metrics=[Metric(name="activeUsers")],
        )
        response_countries = client.run_realtime_report(request_countries)
        
        countries = {}
        for row in response_countries.rows:
            country = row.dimension_values[0].value
            users = int(row.metric_values[0].value)
            countries[country] = users
        
        # Get active users by city (NEW)
        request_cities = RunRealtimeReportRequest(
            property=f"properties/{GA_PROPERTY_ID}",
            dimensions=[Dimension(name="city"), Dimension(name="country")],
            metrics=[Metric(name="activeUsers")],
        )
        response_cities = client.run_realtime_report(request_cities)
        
        cities = []
        for row in response_cities.rows:
            city = row.dimension_values[0].value
            country = row.dimension_values[1].value
            users = int(row.metric_values[0].value)
            cities.append({"city": city, "country": country, "users": users})
        
        # Get active users by device category (NEW)
        request_devices = RunRealtimeReportRequest(
            property=f"properties/{GA_PROPERTY_ID}",
            dimensions=[Dimension(name="deviceCategory")],
            metrics=[Metric(name="activeUsers")],
        )
        response_devices = client.run_realtime_report(request_devices)
        
        devices = {}
        for row in response_devices.rows:
            device = row.dimension_values[0].value
            users = int(row.metric_values[0].value)
            devices[device] = users
        
        # Get active events (NEW)
        request_events = RunRealtimeReportRequest(
            property=f"properties/{GA_PROPERTY_ID}",
            dimensions=[Dimension(name="eventName")],
            metrics=[Metric(name="eventCount")],
        )
        response_events = client.run_realtime_report(request_events)
        
        events = {}
        for row in response_events.rows:
            event = row.dimension_values[0].value
            count = int(row.metric_values[0].value)
            events[event] = count
        
        # Get traffic by minute (last 30 minutes) (NEW)
        request_minutes = RunRealtimeReportRequest(
            property=f"properties/{GA_PROPERTY_ID}",
            dimensions=[Dimension(name="minutesAgo")],
            metrics=[Metric(name="activeUsers")],
        )
        response_minutes = client.run_realtime_report(request_minutes)
        
        minutes_data = []
        for row in response_minutes.rows:
            minutes_ago = int(row.dimension_values[0].value)
            users = int(row.metric_values[0].value)
            minutes_data.append({"minutesAgo": minutes_ago, "users": users})
        
        # Sort by minutesAgo ascending
        minutes_data.sort(key=lambda x: x["minutesAgo"])
        
        return {
            "activeVisitors": active_users,
            "urls": pages,
            "countries": countries,
            "cities": cities,
            "devices": devices,
            "events": events,
            "minutesTrend": minutes_data,
            "timestamp": datetime.now().isoformat()
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Realtime API error: {str(e)}")


@app.get("/api/events")
async def get_events(days: int = Query(default=7, ge=1, le=365)):
    """Get custom events breakdown."""
    from google.analytics.data_v1beta.types import OrderBy
    
    results = run_report(
        dimensions=["eventName"],
        metrics=["eventCount"],
        days=days,
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="eventCount"), desc=True)],
        limit=20
    )
    
    events = [{"x": r.get("eventName", "unknown"), "y": r.get("eventCount", 0)} for r in results]
    
    return {"events": events, "period": f"{days}d"}


@app.get("/api/landing-pages")
async def get_landing_pages(days: int = Query(default=7, ge=1, le=365), limit: int = Query(default=10, le=50)):
    """Get entry/landing pages."""
    from google.analytics.data_v1beta.types import OrderBy
    
    results = run_report(
        dimensions=["landingPage"],
        metrics=["sessions", "bounceRate"],
        days=days,
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
        limit=limit
    )
    
    pages = [
        {
            "x": r.get("landingPage", "/"),
            "y": r.get("sessions", 0),
            "bounceRate": round(r.get("bounceRate", 0) * 100, 1)
        }
        for r in results
    ]
    
    return {"landingPages": pages, "period": f"{days}d"}


@app.get("/api/exit-pages")
async def get_exit_pages(days: int = Query(default=7, ge=1, le=365), limit: int = Query(default=10, le=50)):
    """Get exit pages (pages where users leave). Note: Using pagePath with exits metric."""
    from google.analytics.data_v1beta.types import OrderBy
    
    # GA4 doesn't have a direct "exitPage" dimension like UA
    # We use pagePath + exits metric as approximation
    results = run_report(
        dimensions=["pagePath"],
        metrics=["sessions"],  # Using sessions as proxy, exits not directly available in Data API
        days=days,
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
        limit=limit
    )
    
    pages = [{"x": r.get("pagePath", "/"), "y": r.get("sessions", 0)} for r in results]
    
    return {"exitPages": pages, "period": f"{days}d"}


# ============ Run Server ============

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
