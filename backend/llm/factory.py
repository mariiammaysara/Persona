from typing import Optional
from config import PRIMARY_MODEL, FALLBACK_MODEL, LLM_PROVIDER
from llm.base import BaseLLM
from llm.huggingface_engine import HuggingFaceEngine

def create_llm_engine() -> BaseLLM:
    """
    Factory function to create the configured LLM engine.
    """
    if LLM_PROVIDER.lower() == "hf":
        return HuggingFaceEngine(
            model=PRIMARY_MODEL,
            fallback_model=FALLBACK_MODEL,
            retries=1,
            retry_delay=1.0
        )
    else:
        raise ValueError(f"Unsupported LLM_PROVIDER: {LLM_PROVIDER}")
