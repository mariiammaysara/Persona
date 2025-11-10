#  Character AI Chatbot

An intelligent **AI chatbot** powered by **Google Gemini API**, designed to let users chat naturally with various fictional and personality-based characters.  
Each character has its own **tone, style, and behavior**, providing a unique interactive experience.  

Built with **FastAPI** (backend) and **Streamlit** (frontend).

Example conversation with Sherlock Holmes:

---

##  Features

✅ Multi-character chat system (Sherlock Holmes, Tony Stark, Yoda, etc.)  
✅ Interactive and modern Streamlit UI  
✅ Contextual memory (remembers chat history)  
✅ Real-time responses via Gemini API  
✅ Secure API key management with `.env`  
✅ Modular and extensible design — add new personas easily  

---

##  Project Architecture

```bash
character-ai/
│
├── .env                  # Stores GEMINI_API_KEY (excluded from Git)
├── .gitignore            # Ignores venv, __pycache__, and .env
│
├── app_streamlit.py      # Streamlit frontend
├── main.py               # FastAPI backend (Gemini integration)
├── characters.py         # Character personality definitions
├── config.py             # Loads environment variables
├── list_models.py        # (Optional) Lists Gemini models
├── test_gemini.py        # Tests Gemini API connection
│
├── requirements.txt      # Dependencies
└── README.md             # Documentation
```
##  Tech Stack

| Layer | Technology |
|--------|-------------|
|  Frontend | [Streamlit](https://streamlit.io/) —  web UI |
|  Backend | [FastAPI](https://fastapi.tiangolo.com/) —  API framework |
|  AI Engine | [Google Gemini API](https://ai.google.dev/) — generative AI model |
|  Environment | Python 3.10+ |
|  Secrets Management | `.env` (for secure API key storage) |

### **AI Characters**

**Each AI persona is defined in characters.py and behaves differently:**
Character	Personality & Behavior
🕵️‍♂️ **Sherlock Holmes**	Logical, observant, speaks formally, deduces insights.
🧠 **Tony Stark**	Witty, confident, and humorous; uses tech jargon.
🧙‍♂️ **Yoda**	Wise, cryptic, speaks in inverted syntax.
📚 **Hermione Granger**	Intelligent, factual, and slightly perfectionist.
🐾 **Sleepy Cat (Mittens)**	Cute and lazy; short, sleepy replies with emojis.   

Developers can easily add new characters by editing characters.py
and adding their personality prompt.

 ### Future Work

Improve the overall UI/UX for a smoother chat experience.

Add options to manage and customize characters.

Deploy the project on Hugging Face Spaces for public access and easier interaction.
 ### Installation
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/character-ai-chatbot.git
cd character-ai-chatbot

2️⃣ Create Virtual Environment
python -m venv venv
source venv/bin/activate     # On Mac/Linux
venv\Scripts\activate        # On Windows

3️⃣ Install Requirements
pip install -r requirements.txt

4️⃣ Set Up Environment Variables
Create a .env file and add your Gemini API key:
GEMINI_API_KEY=your_api_key_here

 ### Usage
1️⃣ Run the FastAPI Backend
uvicorn main:app --reload
The API will run at http://127.0.0.1:8000

2️⃣ Run the Streamlit Frontend
streamlit run app_streamlit.py