import os
from dotenv import load_dotenv
from pathlib import Path

# Locate .env in the root directory (one level up from backend)
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    print(f"DEBUG: Looking for .env file at: {env_path}")
    print(f"DEBUG: Current Working Directory: {os.getcwd()}")
    raise ValueError("GROQ_API_KEY not found in .env file. Please make sure you have created the file and added the key.")