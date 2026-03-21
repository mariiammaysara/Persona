'''
Persona entity — defines a character's identity, system prompt,
and per-persona LLM tuning parameters.

PersonaLLMConfig holds model hyperparameters that are unique to each
character — allowing Sherlock to be precise (low temp) while Yoda
remains creative (high temp).
'''
from dataclasses import dataclass, field
from app.domain.enums import PersonaID

@dataclass
class PersonaLLMConfig:
    '''Configuration for LLM generation parameters.'''
    temperature: float = 0.7
    max_tokens: int = 450
    top_p: float = 0.9
    presence_penalty: float = 0.6

@dataclass(frozen=True)
class Persona:
    '''Represents a persona's identity and configuration.'''
    id: PersonaID
    name: str
    system_prompt: str
    llm_config: PersonaLLMConfig = field(default_factory=PersonaLLMConfig)
