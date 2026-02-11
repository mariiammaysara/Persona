from abc import ABC, abstractmethod
from typing import Generator, List, Dict, Any, Optional

class BaseLLM(ABC):
    """
    Abstract base class for LLM engines.
    """
    
    @abstractmethod
    def stream_chat(
        self, 
        messages: List[Dict[str, str]], 
        temperature: float = 0.7, 
        max_tokens: int = 1024,
        top_p: float = 0.9,
    ) -> Generator[str, None, None]:
        """
        Stream chat completion from the LLM.
        
        Args:
            messages: List of message dictionaries with 'role' and 'content'.
            temperature: Sampling temperature.
            max_tokens: Maximum tokens to generate.
            top_p: Nucleus sampling probability.
            
        Yields:
            str: Chunks of generated text.
        """
        pass
