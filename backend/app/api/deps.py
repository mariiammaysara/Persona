'''
Dependency injection wiring — the only place in the API layer that
imports infrastructure. All dependencies are constructed here and
injected into route handlers via FastAPI's Depends() mechanism.

Using @lru_cache ensures providers are singletons across requests.
'''
from functools import lru_cache
from fastapi import Depends
from app.core.config import get_settings
from app.infrastructure.llm.groq_provider import GroqProvider
from app.infrastructure.persona_registry import PersonaRegistry
from app.application.use_cases.chat_use_case import ChatUseCase


@lru_cache
def get_groq_provider() -> GroqProvider:
    '''Provide a singleton instance of the GroqProvider.'''
    return GroqProvider(api_key=get_settings().groq_api_key)


@lru_cache
def get_persona_registry() -> PersonaRegistry:
    '''Provide a singleton instance of the PersonaRegistry.'''
    return PersonaRegistry()


def get_chat_use_case(
    llm: GroqProvider = Depends(get_groq_provider),
    registry: PersonaRegistry = Depends(get_persona_registry),
) -> ChatUseCase:
    '''Inject dependencies into the ChatUseCase orchestrator.'''
    return ChatUseCase(llm=llm, registry=registry)
