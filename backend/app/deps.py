from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from .database import SessionLocal
from . import crud, security
from fastapi import status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
        token: str = Depends(oauth2_scheme), 
        db: Session = Depends(get_db)
        ):
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = security.decode_token(token)
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        user_id_int = int(user_id)
    except (JWTError, ValueError):
        raise credentials_exception

    user = crud.get_user(db, user_id_int)
    if user is None:
        raise credentials_exception
    return user