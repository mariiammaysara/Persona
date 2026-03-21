'''
Domain enums — shared constants with zero external dependencies.
These are the single source of truth for all string literals used
across layers.
'''
from enum import StrEnum


class PersonaID(StrEnum):
    SHERLOCK   = "sherlock"
    TONY_STARK = "tony_stark"
    YODA       = "yoda"
    HERMIONE   = "hermione"
    MITTENS    = "mittens"


class MessageRole(StrEnum):
    SYSTEM    = "system"
    USER      = "user"
    ASSISTANT = "assistant"
