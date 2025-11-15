# Character AI Chatbot

A powerful, personality-driven AI chatbot built with **FastAPI** (backend) and **Streamlit** (frontend), enabling natural conversations with multiple fictional characters — each with its own tone, behavior, and speaking style.

This project integrates with **Google Gemini API** to deliver intelligent, contextual, and highly customizable chat interactions.

---

## Features

### Multi-Character AI Personas

Create dynamic conversations with characters such as:

* **Sherlock Holmes** — observant, logical, and formal
* **Tony Stark** — confident, witty, and tech‑savvy
* **Yoda** — wise and cryptic with inverted syntax
* **Hermione Granger** — factual, insightful, perfectionist
* **Sleepy Cat (Mittens)** — cute, lazy, and emoji-filled

Each character has a unique “personality prompt” stored in `characters.py`.

### Real-Time AI Conversations

* Powered by **Google Gemini API**
* Fast, contextual replies
* Maintains chat memory to provide consistent behavior

###  Interactive UI (Streamlit)

* Minimal chat interface
* Character selection menu
* Real-time streaming responses
* Easy to customize & extend

### Secure Environment Setup

* API keys stored inside `.env`
* Git-safe using `.gitignore`

### Modular Architecture

* Easy to add new characters
* Easy to change model or extend backend

---

## Project Architecture

```
character-ai/
│
├── .env                      # Stores GEMINI_API_KEY (excluded from Git)
├── .gitignore                # Ignores venv, __pycache__, .env
│
├── app_streamlit.py          # Streamlit frontend (UI)
├── main.py                   # FastAPI backend (Gemini integration)
├── characters.py             # Character personality definitions
├── config.py                 # Environment & settings loader
├── list_models.py            # (Optional) List available Gemini models
├── test_gemini.py            # Test connection and model responses
│
├── requirements.txt          # Python dependencies
└── README.md                 # Documentation
```

---

## Tech Stack

| Layer                  | Technology          |
| ---------------------- | ------------------- |
| **Frontend**           | Streamlit — Chat UI |
| **Backend**            | FastAPI — REST API  |
| **AI Engine**          | Google Gemini API   |
| **Environment**        | Python 3.10+        |
| **Secrets Management** | .env file           |

---

## AI Characters (Personas)

All characters are defined in `characters.py` and structured as configurable personality prompts.

Each persona includes:

* **Tone**
* **Speaking style**
* **Behavioral rules**
* **Vocabulary preferences**
* **Dialogue style**

Add new characters easily by appending a new dictionary entry.

---

## Future Enhancements

* Improve Streamlit UI/UX
* Add user-customizable character settings
* Deploy on **Hugging Face Spaces** for public access
* Add chat history export

---

## Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-account>/character-ai-chatbot.git
cd character-ai-chatbot
```

### 2️⃣ Create a Virtual Environment

```bash
python -m venv venv
source venv/bin/activate      # Mac / Linux
venv\Scripts\activate         # Windows
```

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Set Up Environment Variables

Create a `.env` file:

```
GEMINI_API_KEY=your_api_key_here
```

---

## Usage

### 1️⃣ Run the FastAPI Backend

```bash
uvicorn main:app --reload
```

API available at:

```
http://127.0.0.1:8000
```

### 2️⃣ Run the Streamlit Frontend

```bash
streamlit run app_streamlit.py
```

Chat UI available at:

```
http://localhost:8501
```

---

## Notes

* The backend handles interaction with the Gemini API.
* Streamlit sends the prompt + character persona + history.
* Responses remain consistent with the character's defined style.

---

##  License

This project is open-source under the **MIT License**.

---



