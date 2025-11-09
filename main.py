from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from config import GEMINI_API_KEY
from characters import character_personalities as characters  # Import character dictionary

# ===============================================================
#  CONFIGURATION
# ===============================================================
# Configure Gemini API using the secret key from .env file
# (The GEMINI_API_KEY variable is loaded inside config.py)
# ===============================================================
genai.configure(api_key=GEMINI_API_KEY)

# Create the FastAPI application
app = FastAPI(title="Character AI Chatbot using Google Gemini API")

# ===============================================================
#  DATA MODELS (Request / Response)
# ===============================================================
class ChatRequest(BaseModel):
    character: str          # Selected character name
    message: str            # User's message text
    history: list = []      # Chat history as list of {user, assistant} pairs

class ChatResponse(BaseModel):
    reply: str              # AI's reply
    history: list           # Updated chat history
# ===============================================================


# ===============================================================
#  ROOT ENDPOINT
# ===============================================================
@app.get("/")
def home():
    """Simple test endpoint to verify that the API is running."""
    return {"message": "✅ Character AI Chatbot API is running successfully!"}


# ===============================================================
#  GET /characters
# ===============================================================
@app.get("/characters")
def get_characters():
    """Return a list of available character personas."""
    return {"characters": list(characters.keys())}


# ===============================================================
#  POST /chat
# ===============================================================
@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    """Main chat endpoint — generates a reply based on the chosen character."""
    
    # Validate character selection
    if req.character not in characters:
        raise HTTPException(status_code=400, detail="Character not found.")
    
    # Get the system prompt for the chosen character
    system_prompt = characters[req.character]
    context = system_prompt + "\n\n"

    # Add conversation history
    for turn in req.history:
        context += f"User: {turn['user']}\nAssistant: {turn['assistant']}\n"
    context += f"User: {req.message}\nAssistant:"

    # Generate AI reply using the latest Gemini model
    model = genai.GenerativeModel(model_name="models/gemini-2.5-flash")
    response = model.generate_content(context)
    reply = response.text.strip()

    # Update chat history
    req.history.append({"user": req.message, "assistant": reply})

    # Return response
    return ChatResponse(reply=reply, history=req.history)
