from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    groq_api_key: str = Field(default="")
    model_name: str = Field(default="llama-3.3-70b-versatile")
    app_name: str = Field(default="AI Chatbot")
    debug: bool = Field(default=False)


settings = Settings()