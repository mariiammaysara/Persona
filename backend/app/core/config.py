'''
Settings — application configuration via pydantic-settings.
Values are loaded from the .env file at startup.
Use get_settings() (cached) instead of instantiating Settings directly.
'''
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from app.infrastructure.enums import GroqModel

class Settings(BaseSettings):
    '''Global application settings loaded from environment variables.'''
    groq_api_key: str
    allowed_origins: list[str] = [
        "https://persona.mariammaysara.com",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    model: str = GroqModel.LLAMA_70B

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

@lru_cache
def get_settings() -> Settings:
    return Settings()
