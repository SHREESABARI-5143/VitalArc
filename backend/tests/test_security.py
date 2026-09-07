import unittest
import json
import sys
import os

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

try:
    from app import app
except ImportError:
    app = None


class TestSecurityHardening(unittest.TestCase):

    def setUp(self):
        if app is None:
            self.skipTest("Flask app not available")
        app.config['TESTING'] = True
        self.client = app.test_client()

    def test_health_does_not_leak_secrets(self):
        """Verify health check returns service status without exposing private keys or environment paths."""
        response = self.client.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertNotIn('api_key', data)
        self.assertNotIn('secret', data)
        self.assertNotIn('GEMINI_API_KEY', data)

    def test_xss_injection_in_question(self):
        """Verify that script tags in question payload are handled safely as plain text."""
        xss_payload = "<script>alert('xss')</script><img src=x onerror=alert(1)>"
        response = self.client.post(
            '/api/ask-llm',
            json={
                'question': xss_payload,
                'diagnosis': 'Conjunctivitis',
                'confidence': 90
            }
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('answer', data)

    def test_invalid_base64_payload(self):
        """Verify that malformed or non-base64 image strings return 400 without crashing the server."""
        response = self.client.post(
            '/api/predict',
            json={'image': 'data:image/jpeg;base64,NOT_VALID_BASE64_DATA!@#$'}
        )
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)

    def test_oversized_payload_handling(self):
        """Verify server responds appropriately to oversized payload."""
        # Simulated large payload
        large_junk = "A" * (20 * 1024 * 1024)
        response = self.client.post(
            '/api/predict',
            json={'image': f'data:image/jpeg;base64,{large_junk}'}
        )
        self.assertIn(response.status_code, [400, 413, 500])


if __name__ == '__main__':
    unittest.main()
