'''
Application factory — creates and configures the FastAPI app.

Responsibilities:
- CORS middleware setup
- Route registration
- Global exception handlers
- Health check endpoint
'''
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.routes import chat
from app.core.config import get_settings
from app.core.exceptions import PersonaNotFoundError, LLMProviderError
from app.core.enums import ErrorCode

def create_app() -> FastAPI:
    '''Initialize and configure the FastAPI application instance.'''
    settings = get_settings()
    app = FastAPI(
        title="Persona AI", 
        description="Clean Architecture Refactor of Persona AI Backend",
        version="1.0.0"
    )

    # Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Routers
    app.include_router(chat.router, prefix="/api/v1")

    # Exception Handlers
    @app.exception_handler(PersonaNotFoundError)
    async def persona_not_found_handler(request: Request, exc: PersonaNotFoundError):
        return JSONResponse(
            status_code=404,
            content={"error": str(exc), "code": exc.code},
        )

    @app.exception_handler(LLMProviderError)
    async def llm_provider_error_handler(request: Request, exc: LLMProviderError):
        return JSONResponse(
            status_code=503,
            content={"error": "The AI service is temporarily unavailable.", "code": exc.code},
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        # In production, you'd log the stack trace here
        return JSONResponse(
            status_code=500,
            content={"error": "An internal server error occurred.", "code": ErrorCode.INTERNAL_ERROR},
        )

    @app.get("/health")
    async def health():
        '''Basic health check endpoint to verify service availability.'''
        return {"status": "ok", "version": "1.0.0"}

    return app

app = create_app()
