from pydantic import BaseModel
from typing import Literal, List, Optional

from app.domain.enums import MessageRole, PersonaID

class HistoryItem(BaseModel):
    role: MessageRole
    content: str

class ChatRequest(BaseModel):
    # Deliberately `str`, not `PersonaID` — an unknown value must reach
    # PersonaRegistry.get() and raise PersonaNotFoundError (404), rather
    # than being rejected by pydantic enum validation (422) before the
    # route ever runs.
    character: str
    message: str
    history: List[HistoryItem] = []

class ChatResponse(BaseModel):
    content: str
