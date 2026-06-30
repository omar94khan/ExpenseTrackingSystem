import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

def _split_csv(value: str | None) -> List[str]:
    if not value:
        return []
    return [v.strip() for v in value.split(",") if v.strip()]

ENV = os.getenv("ENV", "local") # change to production in prod environment

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./database/transactions.db")

SECRET_KEY = os.getenv("SECRET_KEY")  # must be overridden in prod
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable must be set — refusing to start with no signing key.")

ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

CORS_ORIGINS = _split_csv(os.getenv("CORS_ORIGINS", "*"))

OIC_USERNAME = os.getenv("OIC_USERNAME","")
OIC_PASSWORD = os.getenv("OIC_PASSWORD","")

CARDLIST_API = os.getenv("CARDLIST_API","")

SMTP_EMAIL_ADDRESS = os.getenv("SMTP_EMAIL_ADDRESS","")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD","")
