import logging
import time
from typing import Generator, List, Dict, Any, Optional
from huggingface_hub import InferenceClient
try:
    from huggingface_hub.utils import HfHubHTTPError
except ImportError:
    # Fallback for older versions or if moved
    from requests.exceptions import HTTPError as HfHubHTTPError

from llm.base import BaseLLM
from config import HF_TOKEN

import os

logger = logging.getLogger(__name__)

class HuggingFaceEngine(BaseLLM):
    """
    HuggingFace implementation of the LLM engine using InferenceClient.
    """

    def __init__(
        self, 
        model: str, 
        fallback_model: Optional[str] = None,
        retries: int = 1,
        retry_delay: float = 2.0
    ):
        """
        Initialize the HuggingFace engine.
        
        Args:
            model (str): Primary model ID (e.g., "Qwen/Qwen2.5-7B-Instruct").
            fallback_model (str, optional): Fallback model ID if primary fails.
            retries (int): Number of retries for transient errors before fallback.
            retry_delay (float): Delay in seconds between retries.
        """
        if not HF_TOKEN:
             raise ValueError("HF_TOKEN is not set.")
        
        self.client = InferenceClient(token=HF_TOKEN)
        self.primary_model = model
        self.fallback_model = fallback_model
        self.retries = retries
        self.retry_delay = retry_delay

    def stream_chat(
        self, 
        messages: List[Dict[str, str]], 
        temperature: float = 0.7, 
        max_tokens: int = 1024,
        top_p: float = 0.9,
    ) -> Generator[str, None, None]:
        """
        Streams chat completions, handling errors and fallbacks.
        """
        start_time = time.time()
        # Force fallback logic for testing/debugging
        force_fallback = os.getenv("FORCE_FALLBACK", "false").lower() == "true"
        model_used = None
        
        try:
            if force_fallback and self.fallback_model:
                logger.warning("FORCE_FALLBACK is enabled. Skipping primary model.")
                model_used = self.fallback_model
                yield from self._try_stream(
                    model=self.fallback_model,
                    messages=messages,
                    temperature=temperature,
                    max_tokens=max_tokens,
                    top_p=top_p
                )
            else:
                logger.info(f"Attempting primary model: {self.primary_model}")
                try:
                    model_used = self.primary_model
                    yield from self._try_stream(
                        model=self.primary_model,
                        messages=messages,
                        temperature=temperature,
                        max_tokens=max_tokens,
                        top_p=top_p
                    )
                except Exception as e:
                    logger.warning(f"Primary model '{self.primary_model}' failed. Switching to fallback.")
                    logger.warning(str(e))
                    
                    if self.fallback_model:
                        logger.info(f"Switching to fallback model: '{self.fallback_model}'")
                        model_used = self.fallback_model
                        try:
                            yield from self._try_stream(
                                model=self.fallback_model,
                                messages=messages,
                                temperature=temperature,
                                max_tokens=max_tokens,
                                top_p=top_p
                            )
                        except Exception as fallback_error:
                            logger.error(f"Fallback model '{self.fallback_model}' also failed: {fallback_error}")
                            raise fallback_error
                    else:
                        raise e

            # Log latency after successful completion
            end_time = time.time()
            latency = end_time - start_time
            logger.info(f"Model used: {model_used}")
            logger.info(f"Latency: {latency:.2f}s")

        except Exception as final_error:
            # If an error escalated out (e.g., both failed), we still log what happened up to crash
            end_time = time.time()
            logger.error(f"Chat generation failed after {end_time - start_time:.2f}s")
            raise final_error

    def _try_stream(
        self, 
        model: str, 
        messages: List[Dict[str, str]], 
        temperature: float, 
        max_tokens: int,
        top_p: float
    ) -> Generator[str, None, None]:
        """
        Internal helper to stream from a specific model with retries.
        """
        attempt = 0
        last_error = None
        
        while attempt <= self.retries:
            try:
                stream = self.client.chat_completion(
                    model=model,
                    messages=messages,
                    temperature=temperature,
                    max_tokens=max_tokens,
                    top_p=top_p,
                    stream=True
                )
                
                for chunk in stream:
                    content = chunk.choices[0].delta.content
                    if content:
                        yield content
                return # Success

            except Exception as e:
                # We catch general Exception to be safe for fallback, but specialize if needed
                last_error = e
                logger.warning(f"Error streaming from '{model}' (Attempt {attempt+1}/{self.retries+1}): {e}")
                attempt += 1
                if attempt <= self.retries:
                    time.sleep(self.retry_delay)
        
        # If we exhausted retries for this model
        raise last_error
