from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from config import GEMINI_API_KEY
from characters import character_personalities as characters


# --- API Configuration ---
genai.configure(api_key=GEMINI_API_KEY)
app = FastAPI(title="Character AI Chatbot using Google Gemini API")


# --- Data Models ---
class ChatRequest(BaseModel):
    """Schema for chat requests."""
    character: str
    message: str
    history: list = []


class ChatResponse(BaseModel):
    """Schema for chat responses."""
    reply: str
    history: list


# --- Root Endpoint ---
@app.get("/")
def home():
    """Health check endpoint."""
    return {"message": "✅ Character AI Chatbot API is running successfully!"}


# --- Characters Endpoint ---
@app.get("/characters")
def get_characters():
    """Return all available AI characters."""
    return {"characters": list(characters.keys())}


# --- Chat Endpoint ---
@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    """
    Generate a chatbot reply based on the selected character persona.

    Args:
        req (ChatRequest): Contains character, user message, and chat history.

    Returns:
        ChatResponse: Model containing AI reply and updated conversation history.
    """
    if req.character not in characters:
        raise HTTPException(status_code=400, detail="Character not found.")

    system_prompt = characters[req.character]
    context = f"{system_prompt}\n\n"

    # Append previous history
    for turn in req.history:
        context += f"User: {turn['user']}\nAssistant: {turn['assistant']}\n"
    context += f"User: {req.message}\nAssistant:"

    try:
        model = genai.GenerativeModel(model_name="models/gemini-2.5-flash")
        response = model.generate_content(context)
        reply = response.text.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {str(e)}")

    req.history.append({"user": req.message, "assistant": reply})
    return ChatResponse(reply=reply, history=req.history)
