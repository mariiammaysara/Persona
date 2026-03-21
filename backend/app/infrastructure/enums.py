'''
Infrastructure enums — implementation-specific constants.
Kept separate from domain enums to avoid leaking provider details
into the domain layer.
'''
from enum import StrEnum


class GroqModel(StrEnum):
    LLAMA_70B = "llama-3.3-70b-versatile"
