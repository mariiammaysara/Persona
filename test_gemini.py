import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load API key
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Use the latest available model
try:
    model = genai.GenerativeModel(model_name="models/gemini-2.5-flash")
    response = model.generate_content("Say hello from Gemini 2.5!")
    print("✅ Success! Gemini replied:")
    print(response.text)
except Exception as e:
    print("❌ Error:", e)
