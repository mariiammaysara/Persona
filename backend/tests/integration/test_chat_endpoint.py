'''
Integration tests for POST /api/v1/chat.
Tests the full request/response cycle using FastAPI's TestClient.
Covers: invalid persona (404), valid persona (200 streaming).
'''
import pytest
from fastapi.testclient import TestClient
from app.main import app

from app.core.enums import ErrorCode

client = TestClient(app)

def test_chat_endpoint_missing_persona():
    response = client.post(
        "/api/v1/chat",
        json={"character": "nonexistent", "message": "Hi", "history": []}
    )
    assert response.status_code == 404
    assert response.json()["code"] == ErrorCode.PERSONA_NOT_FOUND

def test_chat_endpoint_invalid_payload():
    response = client.post(
        "/api/v1/chat",
        json={"msg": "Hi"} # Missing fields
    )
    assert response.status_code == 422

def test_chat_endpoint_success():
    response = client.post(
        "/api/v1/chat",
        json={
            "character": "sherlock",
            "message": "Who are you?",
            "history": []
        }
    )
    # With mocked LLM this should return 200
    assert response.status_code == 200

def test_chat_endpoint_invalid_persona():
    from app.core.enums import ErrorCode
    response = client.post(
        "/api/v1/chat",
        json={
            "character": "nonexistent_persona",
            "message": "test",
            "history": []
        }
    )
    assert response.status_code == 404
    assert response.json()["code"] == ErrorCode.PERSONA_NOT_FOUND
