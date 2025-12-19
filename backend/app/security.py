from sqlalchemy.orm import Session
from models import Users 
import schemas

def hash_password(
        password: str
) -> str:
    return "fakehash"+password


def verify_password(
        plain_password: str,
        hashed_password: str
) -> bool:
    return hash_password(plain_password) == hashed_password
