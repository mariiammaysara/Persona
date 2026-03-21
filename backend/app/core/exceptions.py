'''
Custom exceptions — typed errors with structured error codes.
All exceptions map to an ErrorCode enum value, ensuring consistent
JSON error responses across the API.
'''
from app.core.enums import ErrorCode

class PersonaNotFoundError(Exception):
    '''Raised when a requested persona is not found in the registry.'''
    code = ErrorCode.PERSONA_NOT_FOUND

class LLMProviderError(Exception):
    '''Raised when the upstream LLM provider (e.g. Groq) returns an error.'''
    code = ErrorCode.LLM_PROVIDER_ERROR
