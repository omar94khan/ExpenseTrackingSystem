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


@app.get('/users/user-id={user_id}', response_model = schemas.UserOut)
def get_user_by_code(
    user_id: int,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user(db, user_id)
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User doesn't exists")
    
    return db_user


@app.get('/users/username={username}', response_model = schemas.UserOut)
def get_user_by_username(
    username: str,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_username(db, username)
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User doesn't exists")
    
    return db_user


@app.delete('/users/{user_id}', response_model = schemas.UserOut)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    
    deleted_user = crud.delete_user(db,user_id)

    if not deleted_user:
        raise HTTPException(status_code=404, detail="User doesn't exists")
    
    return deleted_user



@app.post("/transactions", response_model=schemas.TransactionOut)
def create_transaction(
    transaction: schemas.TransactionCreate,
    db: Session = Depends(get_db)
):
    db_transaction = crud.create_transaction(db, transaction)

    return db_transaction

@app.get("/transactions/{user_id}", response_model=list[schemas.TransactionOut])
def get_transaction(
    user_id: int,
    db: Session = Depends(get_db)
):
    db_transactions = crud.get_transactions(db, user_id)

    if not db_transactions:
        raise HTTPException(status_code=404, detail=f"No transactions found against the given User ID: {user_id}")

    return db_transactions


@app.delete("/transactions/{transaction_id}", response_model=schemas.TransactionOut)
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db)
):
    db_transactions = crud.delete_transaction(db, transaction_id)

    if not db_transactions:
        raise HTTPException(status_code=404, detail=f"No transactions found against the given Transaction ID: {transaction_id}")

    return db_transactions