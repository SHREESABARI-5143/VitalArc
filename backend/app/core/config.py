"""
VitalArc Core Configuration Module
"""
import os
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class Settings:
    PROJECT_NAME: str = "VitalArc"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Server configuration
    PORT: int = int(os.getenv("PORT", 5001))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    DEBUG: bool = os.getenv("ENVIRONMENT", "development") == "development"
    
    # API Keys & Secrets
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "vitalarc-secure-secret-key")
    
    # Model parameters
    MODEL_INPUT_SIZE: tuple = (224, 224)
    DEFAULT_CLASSES: tuple = ("Conjunctivitis", "Pterygium")
    NORMALIZATION_MEAN: tuple = (0.485, 0.456, 0.406)
    NORMALIZATION_STD: tuple = (0.229, 0.224, 0.225)


settings = Settings()
