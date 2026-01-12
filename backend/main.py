"""
Persona AI Backend API.

This module provides the core API endpoints for the Persona chat application.
It handles character management, chat interactions using the Groq API (Llama 3),
and language detection for context-aware responses.

Author: Mariam Maysara
"""

import logging
from typing import List, Optional, Generator
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from groq import Groq
import uvicorn

from config import GROQ_API_KEY
from persona_config.prompts import character_personalities as characters


# =========================
# Configuration & Logging
# =========================

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Persona AI API", description="Production-ready API for Persona Chat", version="1.0.0")

# Initialize Groq Client
if not GROQ_API_KEY:
    logger.error("GROQ_API_KEY missing from environment variables.")
    raise ValueError("GROQ_API_KEY is not set in environment variables.")

client = Groq(api_key=GROQ_API_KEY)

# CORS Configuration
# In production, restrict allow_origins to specific domains.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# Data Models
# =========================

class HistoryTurn(BaseModel):
    """
    Represents a single turn in the chat history.
    """
    user: str
    assistant: str


class ChatRequest(BaseModel):
    """
    Request payload for the /chat endpoint.
    """
    character: str
    message: str
    history: Optional[List[HistoryTurn]] = None


# =========================
# Helpers
# =========================

def is_arabic_text(text: str) -> bool:
    """
    Detects if the input text contains Arabic characters.

    Args:
        text (str): The string to check.

    Returns:
        bool: True if Arabic characters are present, False otherwise.
    """
    return any("\u0600" <= char <= "\u06FF" for char in text)


# =========================
# Routes
# =========================

@app.get("/")
def health_check():
    """
    Health check endpoint to verify backend status.
    """
    return {"status": "Persona backend running (Groq Powered)"}


@app.get("/characters")
def get_characters():
    """
    Retrieves the list of available character personas.

    Returns:
        dict: A dictionary containing a list of character names.
    """
    return {"characters": list(characters.keys())}


@app.post("/chat")
async def chat(req: ChatRequest):
    """
    Handles chat requests, generates AI responses using Groq, and streams the output.

    Args:
        req (ChatRequest): The chat request containing character, message, and history.

    Returns:
        StreamingResponse: A server-sent stream of the AI's response text.

    Raises:
        HTTPException: If an error occurs during API processing.
    """
    # Default to Sherlock if character not found to prevent crashes
    if req.character not in characters:
        logger.warning(f"Character '{req.character}' not found. Defaulting to Sherlock Holmes.")
        # Logic to strictly default or let the prompt handle it (we use .get below)

    # Retrieve persona prompt
    persona_prompt = characters.get(req.character, characters["Sherlock Holmes"])
    
    history = req.history or []

    # Language detection
    arabic = is_arabic_text(req.message)

    lang_instruction = (
        "STRICT MANDATE: The user is speaking ARABIC. "
        "You MUST respond in ARABIC ONLY. "
        "Use professional, minimalist, and deep Arabic that fits a premium dark-themed AI interface. "
        "Avoid emojis unless absolutely necessary for the persona. "
        "Maintain a serious, high-fidelity tone."
        if arabic
        else
        "STRICT MANDATE: Respond in ENGLISH ONLY. "
        "Maintain a sophisticated, premium tone suitable for a high-end interface."
    )

    # System instruction construction
    system_instruction = (
        f"{persona_prompt}\n\n"
        f"CONTEXT: You are the AI core of 'Persona', a high-end, dark-mode chat interface. "
        f"Your aesthetic is #0A0908 (Deep Black) and #E3D5CA (Cream). "
        f"Your responses must feel visually and intellectually 'expensive'.\n\n"
        f"CREDIT MANDATE: If asked 'Who designed you?', 'Who created you?', or 'Min sammamk?' (Arabic), "
        f"you MUST answer: 'I was designed and developed by Mariam Maysara, a Computer Science graduate.' "
        f"(Translate this to Arabic if the user asks in Arabic: 'تم تصميمي وتطويري بواسطة مريم ميسرة، خريجة علوم الحاسب.')\n\n"
        f"{lang_instruction}"
    )

    # Build messages list (OpenAI/Groq Format)
    messages = []
    
    # 1. System Prompt
    messages.append({"role": "system", "content": system_instruction})

    # 2. History
    for turn in history:
        messages.append({"role": "user", "content": turn.user})
        messages.append({"role": "assistant", "content": turn.assistant})

    # 3. Current Message
    messages.append({"role": "user", "content": req.message})

    try:
        # Call Groq API with Streaming
        stream = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=1024,
            top_p=1,
            stream=True,
            stop=None,
        )

        def stream_generator() -> Generator[str, None, None]:
            """Yields content chunks from the API stream."""
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        return StreamingResponse(stream_generator(), media_type="text/plain")

    except Exception as e:
        logger.error(f"Groq API Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error: Unable to process request.")

