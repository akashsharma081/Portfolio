from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    """
    Application settings configuration loaded from environment variables or .env file.
    """
    DATABASE_URL: str = "sqlite:///./portfolio.db"
    SECRET_KEY: str = "9aefb23184cd761f22e84ab4b6da978bf4c15371ad52b31f7c5e2ff71804b402"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    ADMIN_EMAIL: str = "admin@portfolio.com"
    ADMIN_PASSWORD: str = "Akash@123!"

    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

settings = Settings()
