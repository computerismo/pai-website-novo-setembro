
from dotenv import load_dotenv
load_dotenv()

import os
import gsc

def test_gsc():
    print("Testing GSC Integration...")
    print(f"Property URL: {os.getenv('GSC_PROPERTY_URL')}")
    
    try:
        service = gsc.get_gsc_service()
        if service:
            print("✅ Service initialized successfully.")
            
            # List accessible sites
            print("Checking accessible sites...")
            sites_response = service.sites().list().execute()
            sites = sites_response.get('siteEntry', [])
            print(f"User has access to {len(sites)} sites:")
            for s in sites:
                print(f" - {s['siteUrl']} (Permission: {s['permissionLevel']})")

        else:
            print("❌ Service initialization failed.")
            return

        print("Fetching overview (3 days)...")
        start, end = gsc.get_date_range(3)
        print(f"Date range: {start} to {end}")
        
        data = gsc.fetch_search_analytics(start, end, row_limit=5)
        print(f"✅ Fetch success. Rows returned: {len(data)}")
        if data:
            print(f"Sample row: {data[0]}")
            
        print("Fetching sitemaps...")
        sitemaps = gsc.get_sitemaps_status()
        print(f"✅ Sitemaps fetch success. Count: {len(sitemaps)}")
        for s in sitemaps:
            print(f" - {s.get('path')}: {s.get('lastSubmitted')}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_gsc()
