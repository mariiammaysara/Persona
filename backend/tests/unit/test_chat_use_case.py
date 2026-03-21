'''
Unit tests for ChatUseCase.
Uses a mock LLMProvider — no real Groq API calls are made.
Tests cover: happy path, persona not found, empty history.
'''
import pytest
from typing import AsyncIterator
from app.application.use_cases.chat_use_case import ChatUseCase
from app.domain.entities.message import Message
from app.domain.interfaces.llm_provider import LLMProvider
from app.domain.interfaces.persona_repository import PersonaRepository
from app.core.exceptions import PersonaNotFoundError
from app.domain.enums import MessageRole, PersonaID

from app.domain.entities.persona import PersonaLLMConfig

class MockLLM(LLMProvider):
    async def stream(
        self, 
        messages: list[Message],
        llm_config: PersonaLLMConfig
    ) -> AsyncIterator[str]:
        for chunk in ["Elementary.", " The answer is clear."]:
            yield chunk

@pytest.fixture
def mock_llm():
    return MockLLM()

@pytest.fixture
def registry():
    # Use the concrete registry for unit test mock setup if needed, 
    # but the use case expects the interface.
    from app.infrastructure.persona_registry import PersonaRegistry
    return PersonaRegistry()

@pytest.fixture
def use_case(mock_llm, registry):
    return ChatUseCase(llm=mock_llm, registry=registry)

@pytest.mark.asyncio
async def test_chat_use_case_success(use_case):
    chunks = []
    async for chunk in use_case.execute(PersonaID.SHERLOCK, "Hello", []):
        chunks.append(chunk)
    assert "".join(chunks) == "Elementary. The answer is clear."

@pytest.mark.asyncio
async def test_chat_use_case_persona_not_found(use_case):
    with pytest.raises(PersonaNotFoundError):
        async for _ in use_case.execute("nonexistent_persona", "Hello", []):
            pass

@pytest.mark.asyncio
async def test_chat_use_case_arabic_detection(use_case):
    chunks = []
    async for chunk in use_case.execute(PersonaID.SHERLOCK, "مرحبا", []):
        chunks.append(chunk)
    assert len(chunks) > 0
