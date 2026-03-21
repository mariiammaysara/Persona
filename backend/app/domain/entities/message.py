'''
Message entity — represents a single turn in a conversation.
Role is strictly typed via MessageRole to prevent invalid values.
'''
from dataclasses import dataclass
from app.domain.enums import MessageRole

@dataclass(frozen=True)
class Message:
    '''Represents a single message in the chat history.'''
    role: MessageRole
    content: str
