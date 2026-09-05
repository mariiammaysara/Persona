'''
Integration tests for POST /api/v1/chat.
Tests the full request/response cycle using FastAPI's TestClient.
Covers: invalid persona (404), valid persona (200 streaming).
'''
import pytest
from typing import AsyncIterator
from fastapi.testclient import TestClient
from app.main import app
from app.api.deps import get_chat_use_case
from app.application.use_cases.chat_use_case import ChatUseCase
from app.infrastructure.persona_registry import PersonaRegistry
from app.domain.interfaces.llm_provider import LLMProvider
from app.domain.entities.message import Message
from app.domain.entities.persona import PersonaLLMConfig

from app.core.enums import ErrorCode


class MockLLM(LLMProvider):
    '''Stub LLM provider — no real Groq API calls are made in these tests.'''
    async def stream(
        self,
        messages: list[Message],
        llm_config: PersonaLLMConfig
    ) -> AsyncIterator[str]:
        for chunk in ["Elementary.", " The evidence is unambiguous."]:
            yield chunk


def override_get_chat_use_case() -> ChatUseCase:
    return ChatUseCase(llm=MockLLM(), registry=PersonaRegistry())


app.dependency_overrides[get_chat_use_case] = override_get_chat_use_case
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
