# <p align="center"> P E R S O N A</p>

<p align="center">
  <img src="frontend/public/icon.svg" width="120" height="120" alt="Persona Logo">
</p>

<p align="center">
  <strong>A high-fidelity, minimalist AI chat interface exploring the boundaries of digital identity.</strong>
  <br><br>
  <a href="https://persona.mariammaysara.com/"><strong>✦ Live Demo ✦</strong></a>
  &nbsp;&nbsp; | &nbsp;&nbsp;
  <a href="https://persona-backend-qm5b.onrender.com/docs"><strong>✦ API Docs ✦</strong></a>
</p>

---

## ✦ The Identities

Persona-based interaction is the core of the experience. Each character features a unique "mask" and a distinct psychological framework:

| | Persona | Identity |
| :--- | :--- | :--- |
| <img src="frontend/public/icons/sherlock.svg" width="24"> | **Sherlock Holmes** | A predator of logic. Deductive, cold, and devastatingly precise. |
| <img src="frontend/public/icons/tony.svg" width="24"> | **Tony Stark** | Genius, billionaire, futurist. Technical, confident, and sharp-witted. |
| <img src="frontend/public/icons/yoda.svg" width="24"> | **Master Yoda** | 800 years of wisdom. Ancient, spiritual, and rhythmically profound. |
| <img src="frontend/public/icons/hermione.svg" width="24"> | **Hermione Granger** | Methodical, intellectually rigorous, and academically brilliant. |
| <img src="frontend/public/icons/mittens.svg" width="24"> | **Mittens** | Deeply unbothered. Lazy, judgmental, and endearingly useless. |

---

## ✦ Tech Stack

### **Frontend (The Interface)**
- **Framework**: [Next.js 15+](https://nextjs.org/) (React 19, App Router)
- **Styling**: [Tailwind CSS 4+](https://tailwindcss.com/) (Precision UI Design)
- **Animations**: [Framer Motion 12+](https://www.framer.com/motion/) (60fps Fluid Interactions)
- **Icons**: [Lucide React](https://lucide.dev/) (Minimalist Iconography)
- **Typing**: TypeScript (Strict Structural Integrity)
- **Rendering**: React Markdown & Remark GFM (Rich AI Responses)

### **Backend (The Core)**
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Asynchronous Python 3.12)
- **Server**: [Uvicorn](https://www.uvicorn.org/) (High-performance ASGI)
- **AI Engine**: [Groq Cloud SDK](https://console.groq.com/) (LPU™ Acceleration)
- **Validation**: [Pydantic V2](https://docs.pydantic.dev/) (Data Modeling)
- **Settings**: Pydantic Settings & Dotenv (Env Configuration)

### **Testing & DevOps**
- **Test Suite**: [Pytest](https://docs.pytest.org/) & [Pytest-Asyncio](https://pytest-asyncio.readthedocs.io/)
- **API Client**: [HTTPX](https://www.python-httpx.org/) (Async Testing)
- **Containerization**: [Docker](https://www.docker.com/) (Project Root & Layered Contexts)
- **Orchestration**: [Docker Compose](https://docs.docker.com/compose/) (Production-ready Services)

---

## ✦ System Architecture

Persona is designed around **Clean Architecture**, ensuring that the core business logic remains independent of external frameworks, libraries, and infrastructure.

```text
       ┌──────────────────────────────────┐
       │     ✦ NEXT.JS FRONTEND ✦         │
       │   (Next.js 15, Tailwind CSS)     │
       └────────────────┬─────────────────┘
                        │
                        ▼ [Streaming API]
                        │
       ┌────────────────┴─────────────────┐
       │     ✦ FASTAPI BACKEND ✦          │
       │   (Modular Clean Architecture)   │
       ├──────────────────────────────────┤
       │  1. API LAYER (Routes, Deps)     │
       ├──────────────────────────────────┤
       │  2. APPLICATION (Use Cases)      │
       ├──────────────────────────────────┤
       │  3. DOMAIN (Entities, Enums)     │
       ├──────────────────────────────────┤
       │  4. INFRASTRUCTURE (Groq SDK)    │
       └────────────────┬─────────────────┘
                        │
                        ▼ [LPU Acceleration]
                        │
       ┌────────────────┴─────────────────┐
       │      ✦ GROQ AI ENGINE ✦         │
       │   (Llama 3.3 70B Model)         │
       └──────────────────────────────────┘
```

### **Core Design Principles**
- **Inward Dependencies**: Every layer only points inward. The **Domain** is the core.
- **Contract-Based**: UseCases talk to **Abstract Interfaces** implemented via Groq.
- **Type Safety**: End-to-end typing from TypeScript to Pydantic models.

---

## ✦ Project Structure

```text
.
├── backend/                # FastAPI Asynchronous Backend
│   ├── app/
│   │   ├── api/            # API Layer (Routes, Dependencies)
│   │   ├── application/    # Application Layer (Use Cases)
│   │   ├── core/           # Core Layer (Config, Enums, Exceptions)
│   │   ├── domain/         # Domain Layer (Entities, Interfaces)
│   │   ├── infrastructure/ # Infrastructure Layer (LLM, Registry)
│   │   └── main.py         # Application Factory
│   ├── tests/              # Pytest Suite (Unit & Integration)
│   ├── Dockerfile          # Multi-stage Backend Build
│   └── requirements.txt    # Python Dependencies
├── frontend/               # Next.js 15 Standalone Frontend
│   ├── src/                # Project Source
│   ├── public/             # Static Assets (SVGs, Icons)
│   ├── Dockerfile          # Multi-stage Standalone Build
│   └── next.config.ts      # Standalone & API Rewrites
├── docker-compose.yml      # Orchestration & Health Checks
└── .env.example            # Environment Template
```

---

## ✦ API Reference

- [**✦ API Documentation (Swagger UI) ✦**](https://persona-backend-qm5b.onrender.com/docs)

### **Health Check**
`GET /health`
- **Response**: `{"status": "ok", "version": "1.0.0"}`

### **Chat Interaction (Streaming)**
`POST /api/v1/chat`
- **Request Body**:
  ```json
  {
    "character": "sherlock",
    "message": "The case is simple.",
    "history": []
  }
  ```
- **Response**: `text/event-stream` (Token-by-token streaming).

---

## ✦ Setup & Deployment

### **1. Rapid Start (Docker)**
The most efficient way to run Persona is using Docker Compose.

```bash
# 1. Clone & Configure
git clone https://github.com/mariiammaysara/persona.git
cd persona
cp .env.example .env

# 2. Add your Groq API Key to .env
# 3. Launch
docker-compose up --build
```
*Access frontend at `localhost:3000` and backend at `localhost:8000`.*

### **2. Manual Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## ✦ Design Philosophy

> "Identity is not a fixed state, but a collection of masks we wear for the world."

Persona follows a **Luxury Minimalist** design aesthetic:
- **Palette**: `#0A0908` (Obsidian) backgrounds with `#E3D5CA` (Parchment) accents.
- **Typography**: A sophisticated blend of **Inter** (precision) and **Cormorant Garamond** (elegance).
- **Architecture**: Clean, immutable code that prioritizes readability over complexity.

---

<p align="center">
  © Mariam Maysara
</p>
