
import os
import datetime
from typing import List, Dict, Any, Optional
from google.oauth2 import service_account
from googleapiclient.discovery import build
from fastapi import HTTPException
import json
import tempfile

# Configuration
GSC_PROPERTY_URL = os.getenv("GSC_PROPERTY_URL")

_gsc_service = None

def get_gsc_service():
    """Lazy initialization of Google Search Console service."""
    global _gsc_service
    if _gsc_service:
        return _gsc_service

    try:
        # Check if credentials JSON is provided directly as env var (cloud)
        creds_json = os.getenv("GOOGLE_CREDENTIALS_JSON")
        creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        
        credentials = None

        if creds_json:
            try:
                creds_data = json.loads(creds_json)
                credentials = service_account.Credentials.from_service_account_info(creds_data)
            except json.JSONDecodeError as e:
                print(f"Warning: Failed to parse GOOGLE_CREDENTIALS_JSON: {e}")
        
        if not credentials and creds_path and os.path.exists(creds_path):
             credentials = service_account.Credentials.from_service_account_file(creds_path)
        
        if not credentials:
             # Fallback: try to find credentials.json in current dir
             local_creds = "credentials.json"
             if os.path.exists(local_creds):
                 credentials = service_account.Credentials.from_service_account_file(local_creds)

        if not credentials:
            raise Exception("No valid Google credentials found.")

        _gsc_service = build('searchconsole', 'v1', credentials=credentials)
        return _gsc_service
    except Exception as e:
        print(f"Failed to initialize GSC service: {e}")
        return None

def get_date_range(days: int) -> tuple:
    """Calculate start and end dates for GSC (2 days lag usually)."""
    end_date = datetime.date.today() - datetime.timedelta(days=2)
    start_date = end_date - datetime.timedelta(days=days)
    return start_date.strftime("%Y-%m-%d"), end_date.strftime("%Y-%m-%d")

def fetch_search_analytics(
    start_date: str, 
    end_date: str, 
    dimensions: List[str] = None,
    row_limit: int = 1000
) -> List[Dict[str, Any]]:
    """
    Fetch analytics data from GSC.
    Ref: https://developers.google.com/webmaster-tools/v1/searchanalytics/query
    """
    service = get_gsc_service()
    if not service:
        raise HTTPException(status_code=500, detail="GSC service not initialized")
    
    if not GSC_PROPERTY_URL:
        # Try to discover the property if possible, or raise error
        # For now, we insist on configuration
        raise HTTPException(status_code=500, detail="GSC_PROPERTY_URL not configured")

    request = {
        'startDate': start_date,
        'endDate': end_date,
        'dimensions': dimensions or [],
        'rowLimit': row_limit
    }

    try:
        response = service.searchanalytics().query(
            siteUrl=GSC_PROPERTY_URL, 
            body=request
        ).execute()
        return response.get('rows', [])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GSC Query Error: {str(e)}")

def get_sitemaps_status():
    """List sitemaps and their status."""
    service = get_gsc_service()
    if not service:
        raise HTTPException(status_code=500, detail="GSC service not initialized")
        
    if not GSC_PROPERTY_URL:
        raise HTTPException(status_code=500, detail="GSC_PROPERTY_URL not configured")
        
    try:
        response = service.sitemaps().list(siteUrl=GSC_PROPERTY_URL).execute()
        return response.get('sitemap', [])
    except Exception as e:
        # It's possible to have no permissions specifically for sitemaps or no sitemaps submitted
        print(f"Sitemap fetch error: {e}")
        return []
