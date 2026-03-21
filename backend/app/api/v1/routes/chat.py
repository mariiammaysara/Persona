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
        async for chunk in use_case.execute(
            character_id=request.character,
            user_message=request.message,
            history=domain_history
        ):
            yield chunk

    return StreamingResponse(generate(), media_type="text/event-stream")
