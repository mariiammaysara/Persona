'''
Core enums — cross-cutting constants used across all layers.
ErrorCode drives the JSON error response shape returned to clients.
'''
from enum import StrEnum


class ErrorCode(StrEnum):
    PERSONA_NOT_FOUND  = "PERSONA_NOT_FOUND"
    LLM_PROVIDER_ERROR = "LLM_PROVIDER_ERROR"
    LLM_TIMEOUT        = "LLM_TIMEOUT"
    INVALID_REQUEST    = "INVALID_REQUEST"
    INTERNAL_ERROR     = "INTERNAL_ERROR"
