import os
import unittest

os.environ["ANALYTICS_API_TOKEN"] = "phase-one-test-token-with-40-chars"
os.environ["FRONTEND_ORIGINS"] = "http://localhost:3000"

try:
    from fastapi.testclient import TestClient
    import main
    IMPORT_ERROR = None
except ModuleNotFoundError as error:
    TestClient = None
    main = None
    IMPORT_ERROR = str(error)


@unittest.skipIf(TestClient is None, f"backend test dependencies are unavailable: {IMPORT_ERROR}")
class AnalyticsSecurityTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(main.app)
        self.headers = {"Authorization": f"Bearer {os.environ['ANALYTICS_API_TOKEN']}"}

    def test_health_route_remains_public(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)

    def test_analytics_route_requires_server_token(self):
        response = self.client.get("/api/stats")
        self.assertEqual(response.status_code, 401)

    def test_invalid_query_bounds_are_rejected(self):
        response = self.client.get("/api/stats?days=0", headers=self.headers)
        self.assertEqual(response.status_code, 422)
        response = self.client.get("/api/top-pages?limit=0", headers=self.headers)
        self.assertEqual(response.status_code, 422)
        response = self.client.get("/api/seo/queries?days=91", headers=self.headers)
        self.assertEqual(response.status_code, 422)

    def test_geocode_batch_is_bounded_before_provider_calls(self):
        payload = {"cities": [{"city": f"City {index}", "country": "Test", "users": 1} for index in range(21)]}
        response = self.client.post("/api/geocode-cities", json=payload, headers=self.headers)
        self.assertEqual(response.status_code, 422)


if __name__ == "__main__":
    unittest.main()
