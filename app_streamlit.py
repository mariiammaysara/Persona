import streamlit as st
import requests

# =============== CONFIGURATION ===============
API_URL = "http://127.0.0.1:8000/chat"
CHARACTERS_URL = "http://127.0.0.1:8000/characters"

st.set_page_config(page_title="Character AI", layout="wide")

# =============== STYLES ===============
st.markdown("""
    <style>
    :root {
        --bg-color: #0D0D0D;
        --chat-bg: #1E1E1E;
        --accent: #8A2BE2;
        --text: #EAEAEA;
    }
    body, .stApp {
        background-color: var(--bg-color);
        color: var(--text);
        font-family: 'Poppins', sans-serif;
    }
    .chat-bubble {
        padding: 14px 18px;
        border-radius: 14px;
        margin-bottom: 10px;
        max-width: 80%;
        word-wrap: break-word;
    }
    .user-msg {
        background-color: var(--accent);
        color: white;
        margin-left: auto;
    }
    .bot-msg {
        background-color: var(--chat-bg);
        color: var(--text);
        margin-right: auto;
    }
    .send-button {
        background-color: var(--accent);
        color: white;
        border: none;
        padding: 10px 14px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
    }
    </style>
""", unsafe_allow_html=True)

# =============== LOAD CHARACTERS ===============
try:
    response = requests.get(CHARACTERS_URL)
    CHARACTERS = response.json().get("characters", [])
except:
    CHARACTERS = []

# =============== SIDEBAR ===============
st.sidebar.title("🎭 Choose Character")
selected_character = st.sidebar.selectbox("Select a character:", CHARACTERS)

# =============== HEADER SECTION ===============
st.markdown("""
    <div style="text-align:center; margin-bottom: 20px;">
        <h1 style="color:#8A2BE2; font-family:'Poppins', sans-serif;">Character AI</h1>
        <p style="color:gray; font-size:16px;">Chat naturally with your favorite AI persona below </p>
    </div>
""", unsafe_allow_html=True)

# =============== INIT SESSION ===============
if "history" not in st.session_state:
    st.session_state.history = []

# =============== CHAT DISPLAY ===============
chat_container = st.container()

for h in st.session_state.history:
    if h["role"] == "user":
        chat_container.markdown(f"<div class='chat-bubble user-msg'>{h['content']}</div>", unsafe_allow_html=True)
    else:
        chat_container.markdown(f"<div class='chat-bubble bot-msg'>{h['content']}</div>", unsafe_allow_html=True)

# =============== INPUT BAR ===============
st.markdown("---")
col1, col2 = st.columns([8, 1])
with col1:
    user_input = st.text_input("Type your message...", placeholder="Start chatting...", label_visibility="collapsed")
with col2:
    send = st.button("➤", key="send", use_container_width=True)

# =============== SEND MESSAGE ===============
if send and user_input and selected_character:
    st.session_state.history.append({"role": "user", "content": user_input})

    payload = {
        "character": selected_character,
        "message": user_input,
        "history": [{"user": h["content"], "assistant": ""} for h in st.session_state.history if h["role"] == "user"]
    }

    try:
        res = requests.post(API_URL, json=payload)
        reply = res.json().get("reply", "No reply.")
        st.session_state.history.append({"role": "assistant", "content": reply})
        st.rerun()
    except Exception as e:
        st.error(f"Error: {e}")
