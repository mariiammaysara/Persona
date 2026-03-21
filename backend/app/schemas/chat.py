from pydantic import BaseModel
from typing import Literal, List, Optional

from app.domain.enums import MessageRole, PersonaID

class HistoryItem(BaseModel):
    role: MessageRole
    content: str

class ChatRequest(BaseModel):
    character: PersonaID
    message: str
    history: List[HistoryItem] = []

class ChatResponse(BaseModel):
    content: str
