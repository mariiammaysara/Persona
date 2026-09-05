'''
Chat route — thin handler for POST /api/v1/chat.
Contains zero business logic. All orchestration is delegated to
ChatUseCase which is injected via Depends().
'''
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.schemas.chat import ChatRequest
from app.application.use_cases.chat_use_case import ChatUseCase
from app.domain.entities.message import Message
from app.api.deps import get_chat_use_case
from app.core.exceptions import LLMProviderError

router = APIRouter()

@router.post("/chat")
async def chat_endpoint(
    request: ChatRequest,
    use_case: ChatUseCase = Depends(get_chat_use_case),
):
    '''Handle chat requests by streaming responses from the requested AI persona.'''
    # Convert history schema to domain entities
    domain_history = [
        Message(role=item.role, content=item.content)
        for item in request.history
    ]

    # Perform lookup before stream to catch PersonaNotFoundError early (avoiding RuntimeError)
    use_case.registry.get(request.character)

    async def generate():
        # Once streaming starts, the response's 200 status/headers are
        # already on the wire — an exception here can no longer be turned
        # into a JSON error response by the global handlers. Swallow it
        # into the stream itself instead of letting it crash the ASGI app.
        try:
            async for chunk in use_case.execute(
                character_id=request.character,
                user_message=request.message,
                history=domain_history
            ):
                yield chunk
        except LLMProviderError:
            yield "\n\n_The AI service is temporarily unavailable. Please try again._"

    return StreamingResponse(generate(), media_type="text/event-stream")
