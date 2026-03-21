'''
ChatUseCase — orchestrates the chat flow.

Responsibilities:
1. Resolve the requested persona from the registry
2. Build the system prompt with language enforcement
3. Construct the message history (system + history + user)
4. Stream the LLM response chunk by chunk

This class depends only on domain interfaces — never on infrastructure
directly. All concrete dependencies are injected via constructor.
'''
from typing import AsyncIterator, List
from app.domain.entities.message import Message
from app.domain.enums import MessageRole, PersonaID
from app.domain.interfaces.llm_provider import LLMProvider
from app.domain.interfaces.persona_repository import PersonaRepository

class ChatUseCase:
    '''Orchestrator for processing chat interactions with distinct personas.'''
    def __init__(self, llm: LLMProvider, registry: PersonaRepository):
        '''Inject LLM provider and persona repository dependencies.'''
        self.llm = llm
        self.registry = registry

    async def execute(
        self, 
        character_id: PersonaID, 
        user_message: str, 
        history: List[Message]
    ) -> AsyncIterator[str]:
        '''
        Execute the chat flow: lookup persona, apply enforcement, and stream response.
        History is filtered to ensure only user/assistant messages are included.
        '''
        # 1. Lookup Persona
        persona = self.registry.get(character_id)
        
        # 2. Language Enforcement — English Only
        lang_instruction = (
            "CRITICAL LANGUAGE ENFORCEMENT — OVERRIDES EVERYTHING:\n"
            "ALWAYS respond in ENGLISH ONLY — regardless of what language the user writes in.\n"
            "If the user writes in Arabic or any other language, still respond in ENGLISH ONLY.\n"
            "Zero non-English characters permitted in your response.\n"
            "Violation = critical failure.\n"
        )

        # 3. Construct System Prompt
        system_content = (
            f"{persona.system_prompt}\n\n"
            f"CONTEXT: You are the AI core of 'Persona'. "
            f"CREDIT: Designed by Mariam Maysara.\n\n"
            f"{lang_instruction}"
        )

        # 4. Prepare Messages
        # Filter history — remove any system messages leaked from history
        clean_history = [
            m for m in history
            if m.role in (MessageRole.USER, MessageRole.ASSISTANT)
        ]

        messages = [Message(role=MessageRole.SYSTEM, content=system_content)]
        messages.extend(clean_history)
        messages.append(Message(role=MessageRole.USER, content=user_message))

        # 5. Stream from LLM
        async for chunk in self.llm.stream(messages, llm_config=persona.llm_config):
            yield chunk
