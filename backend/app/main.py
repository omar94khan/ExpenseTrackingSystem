from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from database import engine, Base
from database import SessionLocal
import models
import schemas
import crud

Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users", response_model=schemas.UserOut)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_password = "fakehashed" + user.password
    return crud.create_user(db, user, hashed_password)


@app.get('/users/{id}', response_model = schemas.UserOut)
def get_user_by_code(
    id: int,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user(db, id)
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User doesn't exists")
    
    return db_user


@app.get('/users/by-username/{username}', response_model = schemas.UserOut)
def get_user_by_username(
    username: str,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_username(db, username)
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User doesn't exists")
    
    return db_user