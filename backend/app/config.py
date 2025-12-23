import os
from typing import List

def _split_csv(value: str | None) -> List[str]:
    if not value:
        return []
    return [v.strip() for v in value.split(",") if v.strip()]

ENV = os.getenv("ENV", "local") # change to production in prod environment

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./transactions.db")

SECRET_KEY = os.getenv("SECRET_KEY", "1d5as61f561g561gdfa4g51g5615f6sda23")  # must be overridden in prod
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

CORS_ORIGINS = _split_csv(os.getenv("CORS_ORIGINS", "*"))
