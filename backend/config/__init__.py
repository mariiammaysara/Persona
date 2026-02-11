import os
from dotenv import load_dotenv
from pathlib import Path

# Locate .env
# Priority 1: Inside backend/ directory (parent of config/)
backend_env = Path(__file__).resolve().parent.parent / '.env'
# Priority 2: Project root (parent of backend/)
root_env = Path(__file__).resolve().parent.parent.parent / '.env'

if backend_env.exists():
    env_path = backend_env
else:
    env_path = root_env

load_dotenv(dotenv_path=env_path)

HF_TOKEN = os.getenv("HF_TOKEN")
PRIMARY_MODEL = os.getenv("PRIMARY_MODEL", "Qwen/Qwen2.5-7B-Instruct")
FALLBACK_MODEL = os.getenv("FALLBACK_MODEL", "mistralai/Mistral-7B-Instruct-v0.2")
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "hf")

if not HF_TOKEN:
    # Check if we are in a build environment or if it's explicitly set to skip
    if os.getenv("SKIP_SECRETS_CHECK", "false").lower() == "true":
        pass  # Skip check for build/CI
    else:
        raise ValueError("HF_TOKEN environment variable is missing. Please set it in .env or the environment.")
