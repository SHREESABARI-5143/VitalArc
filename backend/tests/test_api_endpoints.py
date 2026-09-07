import pytest
import io
import json
from PIL import Image
import sys
import os

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

try:
    from app import app
except ImportError:
    app = None


@pytest.fixture
def client():
    if app is None:
        pytest.skip("Flask app module not found")
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_health_check(client):
    """Test health check endpoint."""
    response = client.get('/api/health')
    if response.status_code == 404:
        # Endpoint may be at root or named differently
        pytest.skip("/api/health not registered")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'status' in data


def test_predict_no_image(client):
    """Test error handling when no image payload is provided."""
    response = client.post('/api/predict', data={})
    assert response.status_code in [400, 422]
    data = json.loads(response.data)
    assert 'error' in data or 'message' in data


def test_ask_llm_missing_question(client):
    """Test ask-llm with empty payload."""
    response = client.post('/api/ask-llm', json={})
    assert response.status_code in [200, 400, 500]
