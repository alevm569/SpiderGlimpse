import pytest
from flask import jsonify
from flask_cors import CORS
import re
from crawler import app, extract_entries, filter_by_comments, filter_by_points

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_get_entries(client):
    response = client.get('/api/entries')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    if data:
        assert 'number' in data[0]
        assert 'title' in data[0]
        assert 'points' in data[0]
        assert 'comments' in data[0]

def test_filter_by_comments(client):
    response = client.get('/api/entries/filter/comments')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    if data:
        assert all(len(re.findall(r'\b\w+\b', entry['title'])) > 5 for entry in data)
        assert sorted(data, key=lambda x: x['comments'], reverse=True) == data

def test_filter_by_points(client):
    response = client.get('/api/entries/filter/points')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    if data:
        assert all(len(re.findall(r'\b\w+\b', entry['title'])) <= 5 for entry in data)
        assert sorted(data, key=lambda x: x['points'], reverse=True) == data
