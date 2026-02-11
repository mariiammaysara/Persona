# ✦ P e r s o n a

![Persona Interface](https://github.com/user-attachments/assets/decc3da8-91f7-4428-b304-8da10066d8f2)

## Overview

Persona is a high-fidelity AI chat interface that merges minimalist noir aesthetics with cutting-edge Large Language Models. Built for users who demand more than just utility, Persona offers a visceral user experience featuring immersive soundscapes, fluid animations, and deep, character-driven interactions.

**Version:** 2.0.0

## Features

- **Multi-Persona System**: Switch instantly between distinct AI characters (Sherlock Holmes, Tony Stark, Yoda, etc.) with unique system prompts.
- **Open-Source Intelligence**: Powered by the Hugging Face Inference API, utilizing models like Qwen 2.5 and Mistral 7B.
- **High Availability**: Automatic fallback system reroutes requests to a secondary model if the primary provider fails.
- **Real-Time Streaming**: Low-latency token streaming with a typewriter effect.
- **Session Isolation**: Chat history is persisted locally and isolated per session context.
- **Responsive Design**: Optimized layout for Mobile, Tablet, Desktop, and 4K Displays.
- **Cinematic UI**: 60fps animations, glassmorphism, and a strict "Noir" color palette.

## Architecture Overview

The system follows a clean, modular monorepo architecture:

1. **Frontend (Next.js 15)**: Handles user interaction, state management, and rendering. Uses Tailwind CSS for styling and Framer Motion for animations.
2. **Backend (FastAPI)**: Manages API routes, prompt engineering, and LLM orchestration.
3. **Engine (Hugging Face)**: A robust client wrapper handling API communication, retries, and fallback logic.

## Configuration

The application is configured via environment variables.

| Variable | Description | Default |
| :--- | :--- | :--- |
| `HF_TOKEN` | Hugging Face Access Token (Required) | - |
| `PRIMARY_MODEL` | Main LLM Model ID | `Qwen/Qwen2.5-7B-Instruct` |
| `FALLBACK_MODEL` | Backup LLM Model ID | `mistralai/Mistral-7B-Instruct-v0.2` |
| `FORCE_FALLBACK` | Force usage of backup model (Debug) | `false` |
| `LLM_PROVIDER` | AI Provider Selection | `hf` |

## Local Development

### Prerequisites
- Node.js (v18+)
- Python (v3.11+)
- Hugging Face API Token

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mariiammaysara/persona.git
   cd persona
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env      # Add your HF_TOKEN
   uvicorn main:app --reload
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Docker Deployment

The project is fully containerized for production.

1. **Configure Environment**
   Ensure `backend/.env` contains your `HF_TOKEN`.

2. **Build and Run**
   ```bash
   docker-compose up --build -d
   ```

3. **Access**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8000`

## Production Notes

- **Security**: The `HF_TOKEN` must be kept secret. Do not commit `.env` files.
- **Performance**: The frontend image is optimized using a multi-stage build. The backend uses a slim Python image with a non-root user.
- **Logs**: Structured JSON logging is enabled for container orchestration.

## Security

- **No Hardcoded Secrets**: All sensitive keys are managed via environment variables.
- **Non-Root Execution**: Containers run as unprivileged users (`appuser` / `nextjs`) to minimize attack surface.
- **Input Validation**: All API inputs are validated using Pydantic schemas.

---
<p align="center">
  <strong>Developed by Mariam Maysara</strong>
</p>
