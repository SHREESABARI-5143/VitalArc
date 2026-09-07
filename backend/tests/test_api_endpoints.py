import unittest
import io
import json
import base64
import sys
import os

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

try:
    from PIL import Image
except ImportError:
    Image = None

try:
    from app import app
except ImportError:
    app = None


class TestVitalArcAPI(unittest.TestCase):

    def setUp(self):
        if app is None or Image is None:
            self.skipTest("Flask app or PIL could not be imported")
        app.config['TESTING'] = True
        self.client = app.test_client()

    def test_health_endpoint(self):
        """Verify that the health check endpoint returns 200 OK and model status."""
        response = self.client.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data.get('status'), 'healthy')
        self.assertIn('service', data)
        self.assertIn('classes', data)

    def test_predict_no_payload(self):
        """Verify that prediction without file or image returns 400 Bad Request."""
        response = self.client.post('/api/predict', data={})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)

    def test_predict_with_valid_multipart_image(self):
        """Verify that uploading a valid anterior segment test image returns structured predictions."""
        img = Image.new('RGB', (224, 224), color=(120, 80, 50))
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG')
        img_bytes.seek(0)

        response = self.client.post(
            '/api/predict',
            data={'file': (img_bytes, 'test_eye.jpg')},
            content_type='multipart/form-data'
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('primaryDiagnosis', data)
        self.assertIn('confidence', data)
        self.assertIn('predictions', data)
        self.assertIn('recommendation', data)
        self.assertIsInstance(data['predictions'], list)
        self.assertGreater(len(data['predictions']), 0)

    def test_predict_with_base64_image(self):
        """Verify that submitting a base64 encoded image string returns predictions."""
        img = Image.new('RGB', (100, 100), color=(50, 150, 200))
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        encoded = "data:image/png;base64," + base64.b64encode(img_bytes.getvalue()).decode('utf-8')

        response = self.client.post(
            '/api/predict',
            json={'image': encoded}
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('primaryDiagnosis', data)

    def test_ask_llm_missing_question(self):
        """Verify that /api/ask-llm validates the question field."""
        response = self.client.post('/api/ask-llm', json={})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)

    def test_ask_llm_valid_payload_handling(self):
        """Verify that /api/ask-llm responds gracefully with structured answer."""
        response = self.client.post(
            '/api/ask-llm',
            json={
                'question': 'What are the next steps for Conjunctivitis?',
                'diagnosis': 'Conjunctivitis',
                'confidence': 92.5,
                'recommendation': 'Schedule appointment with eye doctor.'
            }
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('answer', data)


if __name__ == '__main__':
    unittest.main()
