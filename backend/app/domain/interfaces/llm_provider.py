'''
LLMProvider interface — defines the contract for any language model
backend. Concrete implementations (e.g. GroqProvider) live in the
infrastructure layer and depend on this abstraction, not the reverse.
'''
from abc import ABC, abstractmethod
from typing import AsyncIterator
from app.domain.entities.message import Message
from app.domain.entities.persona import PersonaLLMConfig

class LLMProvider(ABC):
    '''Interface for LLM service providers.'''
    @abstractmethod
    async def stream(
        self, 
        messages: list[Message],
        llm_config: PersonaLLMConfig
    ) -> AsyncIterator[str]:
        '''Streams response from the LLM provider.'''
        pass
