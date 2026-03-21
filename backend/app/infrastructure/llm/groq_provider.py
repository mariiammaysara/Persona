'''
GroqProvider — concrete LLMProvider implementation using the Groq SDK.
Streams responses token-by-token using llama-3.3-70b-versatile.
Per-persona LLM config (temperature, top_p, etc.) is applied per call.
'''
import groq
from typing import AsyncIterator
from app.domain.entities.message import Message
from app.domain.entities.persona import PersonaLLMConfig
from app.domain.interfaces.llm_provider import LLMProvider
from app.core.exceptions import LLMProviderError

from app.infrastructure.enums import GroqModel

class GroqProvider(LLMProvider):
    '''Concrete implementation of LLMProvider for Groq Cloud API.'''
    def __init__(self, api_key: str, model: str = GroqModel.LLAMA_70B):
        '''Initialize the Groq client with API key and model selection.'''
        self.client = groq.AsyncGroq(api_key=api_key)
        self.model = model

    async def stream(
        self, 
        messages: list[Message],
        llm_config: PersonaLLMConfig
    ) -> AsyncIterator[str]:
        '''Stream completion chunks from Groq API based on domain messages and config.'''
        try:
            # Convert Domain Message to Groq Message Format
            groq_messages = [
                {"role": m.role, "content": m.content} for m in messages
            ]
            
            completion = await self.client.chat.completions.create(
                model=self.model,
                messages=groq_messages,
                max_tokens=llm_config.max_tokens,
                temperature=llm_config.temperature,
                top_p=llm_config.top_p,
                presence_penalty=llm_config.presence_penalty,
                stream=True,
            )
            
            async for chunk in completion:
                content = chunk.choices[0].delta.content
                if content:
                    yield content
        except Exception as e:
            raise LLMProviderError(f"Groq API error: {str(e)}")
