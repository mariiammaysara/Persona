import gradio as gr
import requests
from datetime import datetime

# ===============================================================
#  CONFIGURATION
# ===============================================================
API_URL = "http://127.0.0.1:8000/chat"
CHARACTERS_URL = "http://127.0.0.1:8000/characters"


# ===============================================================
#  LOAD AVAILABLE CHARACTERS
# ===============================================================
try:
    response = requests.get(CHARACTERS_URL)
    CHARACTER_OPTIONS = response.json().get("characters", [])
except Exception:
    CHARACTER_OPTIONS = []


# ===============================================================
#  HELPER FUNCTIONS
# ===============================================================
def convert_history_to_messages(history):
    """Convert backend format [{'user': 'x', 'assistant': 'y'}] into Gradio message format"""
    messages = []
    for h in history:
        messages.append({"role": "user", "content": h["user"]})
        messages.append({"role": "assistant", "content": h["assistant"]})
    return messages


# ===============================================================
#  CHAT FUNCTION
# ===============================================================
def chat(character, message, history, sessions, active_session):
    """Send a message to the backend and update chat + sessions"""
    if not message.strip():
        return history, "", sessions, active_session, gr.update()

    # Convert Gradio messages to backend format
    backend_history = []
    for i in range(0, len(history), 2):
        user_msg = history[i]["content"] if i < len(history) else ""
        assistant_msg = history[i + 1]["content"] if i + 1 < len(history) else ""
        backend_history.append({"user": user_msg, "assistant": assistant_msg})

    payload = {"character": character, "message": message, "history": backend_history}

    try:
        res = requests.post(API_URL, json=payload)
        res.raise_for_status()
        data = res.json()
        reply = data.get("reply", "No reply received.")
        backend_history = data.get("history", [])
        messages = convert_history_to_messages(backend_history)
    except Exception as e:
        reply = f"Error: {e}"
        messages = history + [{"role": "assistant", "content": reply}]

    # Auto-generate chat name if new
    if active_session not in sessions or not sessions[active_session]["history"]:
        title_message = message.split(" ")[:4]
        title_preview = " ".join(title_message)
        new_name = f"{character} – {title_preview.capitalize()}"
        sessions[new_name] = {"history": messages}
        active_session = new_name
    else:
        sessions[active_session] = {"history": messages}

    chat_list = list(sessions.keys())

    # Return + auto-scroll trigger (via update)
    return (
        messages,
        "",
        sessions,
        active_session,
        gr.update(choices=chat_list, value=active_session, interactive=True),
    )


# ===============================================================
#  NEW CHAT FUNCTION
# ===============================================================
def new_chat(sessions, active_session):
    """Start a new chat session and keep old ones saved"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    new_session_name = f"New Chat ({timestamp})"
    sessions[new_session_name] = {"history": []}
    active_session = new_session_name
    chat_list = list(sessions.keys())
    return [], "", sessions, active_session, gr.update(choices=chat_list, value=active_session)


# ===============================================================
#  RENAME CHAT FUNCTION
# ===============================================================
def rename_chat(sessions, old_name, new_name):
    """Rename an existing chat session"""
    if old_name in sessions:
        sessions[new_name] = sessions.pop(old_name)
    chat_list = list(sessions.keys())
    return (
        sessions.get(new_name, {}).get("history", []),
        "",
        sessions,
        new_name,
        gr.update(choices=chat_list, value=new_name),
    )


# ===============================================================
#  LOAD SAVED CHAT FUNCTION
# ===============================================================
def load_chat(sessions, active_session):
    """Load previously saved session"""
    history = sessions.get(active_session, {}).get("history", [])
    return history, "", sessions, active_session


# ===============================================================
#  UI LAYOUT
# ===============================================================
with gr.Blocks(
    css="""
        footer {display: none !important; visibility: hidden;}
        .wrap.svelte-1rbo3lz {scroll-behavior: smooth;}
    """,
    theme=gr.themes.Soft(),
) as demo:
    gr.Markdown(
        """
        <h1 style='text-align: center; color: #7B68EE;'>Character AI Chatbot</h1>
        <p style='text-align: center; color: gray;'>Chat naturally with your favorite AI characters.<br>
        <b>Developed by Mariam Maysara</b></p>
        <hr>
        """
    )

    sessions_state = gr.State({})
    active_session_state = gr.State("New Chat")

    with gr.Row():
        with gr.Column(scale=1, min_width=220):
            character = gr.Dropdown(
                choices=CHARACTER_OPTIONS,
                label="Choose Character",
                value=CHARACTER_OPTIONS[0] if CHARACTER_OPTIONS else None,
            )

            session_selector = gr.Dropdown(
                label="Saved Chats",
                choices=["New Chat"],
                value="New Chat",
            )

            rename_btn = gr.Button("✏️ Rename Chat")
            new_btn = gr.Button("🆕 New Chat")

        with gr.Column(scale=4):
            chatbot = gr.Chatbot(
                label="Chat Window",
                type="messages",
                height=500,
            )

    with gr.Row():
        msg = gr.Textbox(
            placeholder="Type your message here...",
            show_label=False,
            scale=8,
            autofocus=True,
        )
        send_btn = gr.Button("Send", scale=1)

    # Rename modal
    with gr.Row(visible=False) as rename_modal:
        new_name_input = gr.Textbox(label="Enter new chat name")
        confirm_rename_btn = gr.Button("Confirm Rename")

    # ===============================================================
    #  EVENT HANDLERS
    # ===============================================================
    send_btn.click(
        chat,
        inputs=[character, msg, chatbot, sessions_state, active_session_state],
        outputs=[chatbot, msg, sessions_state, active_session_state, session_selector],
    )

    msg.submit(
        chat,
        inputs=[character, msg, chatbot, sessions_state, active_session_state],
        outputs=[chatbot, msg, sessions_state, active_session_state, session_selector],
    )

    new_btn.click(
        new_chat,
        inputs=[sessions_state, active_session_state],
        outputs=[chatbot, msg, sessions_state, active_session_state, session_selector],
    )

    session_selector.change(
        load_chat,
        inputs=[sessions_state, session_selector],
        outputs=[chatbot, msg, sessions_state, active_session_state],
    )

    rename_btn.click(
        lambda: gr.update(visible=True),
        None,
        rename_modal,
    )

    confirm_rename_btn.click(
        rename_chat,
        inputs=[sessions_state, active_session_state, new_name_input],
        outputs=[chatbot, msg, sessions_state, active_session_state, session_selector],
    ).then(lambda: gr.update(visible=False), None, rename_modal)

# ===============================================================
#  LAUNCH APP
# ===============================================================
if __name__ == "__main__":
    demo.launch()
