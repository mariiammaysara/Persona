# ✦ P E R S O N A

> *A cinematic, luxury AI chat experience designed for the modern intellectual.*
<img width="783" height="193" alt="Screenshot 2026-01-12 042910" src="https://github.com/user-attachments/assets/decc3da8-91f7-4428-b304-8da10066d8f2" />



##  Overview

**Persona** is a high-fidelity AI chat interface that merges minimalist noir aesthetics with cutting-edge Large Language Models. Built for users who demand more than just utility, Persona offers a visceral, "expensive" user experience—featuring immersive soundscapes, fluid animations, and deep, character-driven interactions.

Powered by **Groq** (Llama 3 70B) for lightning-fast, intellectual responses, and orchestrating a seamless dance between a **Next.js** frontend and **FastAPI** backend.

##  Features

*   **Luxury Aesthetics:** A curated palette of Deep Black (`#0A0908`) and Cream (`#E3D5CA`), featuring glassmorphism and breathing ambient animations.
*   **Dynamic Personas:** Switch instantly between distinct AI characters:
    *   🕵️‍♂️ **Sherlock Holmes:** Deductive, cold, and noir-tinged.
    *   🕶️ **Tony Stark:** Futuristic, witty, and engineering-focused.
    *   🧙‍♂️ **Yoda:** Ancient wisdom with inverted syntax.
    *   📚 **Hermione:** Academic precision and logic.
    *   😺 **Mittens:** The laziest cat alive.
*   **Multilingual Intelligence:** Automatically detects Arabic input and switches to high-literary Fusha or dialect depending on the persona.
*   **Tech-First Polish:**
    *   Markdown support (Code blocks, lists, formatting).
    *   Smart Persistence (Chats saved locally).
    *   Smooth "Butter" animations (60fps Framer Motion).
    *   Responsive "Zen" Sidebar.
    *   **Production Ready:** Dockerized architecture with comprehensive documentation.

##  Project Structure

A clean, modular monorepo architecture separating concerns between the high-fidelity UI and the robust AI engine.

```graphql
persona/
├──   frontend/               # Next.js Application (Dockerized)
│   ├── app/                  # App Router (Pages & Layouts)
│   ├── components/           # Reusable UI Components
│   │   ├── ChatArea.tsx      # Message Rendering & Scroll Logic
│   │   ├── ChatInput.tsx     # User Input & Send Animations
│   │   ├── Sidebar.tsx       # Responsive Navigation & Toggle
│   │   ├── Splash.tsx        # Initial "Breathing" Branding
│   │   └── Bubble.tsx        # Markdown Message Bubbles
│   ├── Dockerfile            # Multi-stage release build
│   └── tailwind.config.ts    # Custom Design Tokens (Colors, Fonts)
│
├──   backend/                # FastAPI Server (Dockerized)
│   ├── main.py               # API Routes & Logic
│   ├── persona_config/       # Configuration Modules
│   │   └── prompts.py        # Persona Prompts & Definitions
│   ├── config/               # Environment & Secrets (Package)
│   ├── Dockerfile            # Python slim build
│   └── requirements.txt      # Python Dependencies
│
├── docker-compose.yml        # Orchestration
├── .env.example              # Template for Environment Variables
└── .env                      # API Keys (GitIgnored)
```

##  Architecture Flow

1.  **User Input:** The frontend captures the message and current history.
2.  **API Call:** Next.js sends a structured payload to the backend service.
3.  **Processing:** FastAPI detects the language (Arabic/English) and selects the appropriate Persona System Prompt (e.g., "Sherlock Holmes + Fusha Arabic").
4.  **Inference:** The **Groq Llama 3** engine generates a high-speed response stream.
5.  **Rendering:** The frontend renders the Markdown response in real-time with typing effects.

##  API Reference

### `POST /chat`

Streams a response from the AI persona based on conversation history.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `character` | `string` | The ID of the persona (e.g., "Sherlock Holmes", "Tony Stark"). |
| `message` | `string` | The user's current query. |
| `history` | `array` | List of previous `User` and `Assistant` turns for context. |

**Response:** `text/event-stream` (Chunked plain text)

##  Technology Stack

### Frontend
*   **Framework:** Next.js 15 (React 19)
*   **Styling:** Tailwind CSS v4
*   **Animations:** Framer Motion
*   **Language:** TypeScript
*   **State:** React Hooks + LocalStorage

### Backend
*   **API:** FastAPI (Python)
*   **LLM Engine:** Groq Cloud (Llama 3.3 70B)
*   **Server:** Uvicorn

### DevOps
*   **Containerization:** Docker & Docker Compose
*   **Linting:** ESLint & Python Type Hints

##  Getting Started

### Prerequisites
*   Docker & Docker Compose (Recommended)
*   **OR** Node.js (v18+) & Python (v3.10+)
*   Groq API Key

### 1. Clone the Repository
```bash
git clone https://github.com/mariiammaysara/persona.git
cd persona
```

### 2. Configure Environment
Copy the example environment file and add your key:
```bash
cp .env.example .env
# Edit .env and paste your GROQ_API_KEY
```

### 3. Run with Docker (Recommended) 
The easiest way to run the full stack:
```bash
docker-compose up --build
```
*   Frontend: `http://localhost:3000`
*   Backend: `http://localhost:8000`

### 4. Manual Setup (Alternative)

#### Backend
```bash
cd backend
python -m venv venv
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

##  Design Philosophy

> "Design is not just what it looks like and feels like. Design is how it works."

Every interaction in Persona—from the subtle glow of the signature to the spring-physics of the sidebar—is crafted to feel physical and deliberate. We avoid generic components in favor of a bespoke "Noir" identity.

##  Author

**Designed & Developed by Mariam Maysara**

*    **LinkedIn:** [Mariam Maysara](https://www.linkedin.com/in/mariam-maysara/)
*    **GitHub:** [mariiammaysara](https://github.com/mariiammaysara)

>  **Open for opportunities & collaborations.** Feel free to reach out to discuss AI, Web Development, or Product Design.

---
*© 2026 Persona AI. All Rights Reserved.*
