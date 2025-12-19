from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, Base
from database import SessionLocal
import schemas
import crud
from security import hash_password, verify_password
from fastapi import status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError
import security

##############################################################################################################

Base.metadata.create_all(bind=engine)

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

##############################################################################################################

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

##############################################################################################################

@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Put user identity in the token (sub = subject)
    token = security.create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

##############################################################################################################

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

##############################################################################################################

@app.post("/users", response_model=schemas.UserOut)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_password = security.hash_password(user.password)
    return crud.create_user(db, user, hashed_password)

##############################################################################################################

@app.get('/users/{user_id}', response_model = schemas.UserOut)
def get_user_by_code(
    user_id: int,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user(db, user_id)
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User doesn't exists")
    
    return db_user

##############################################################################################################

@app.get('/users/by-username/{username}', response_model = schemas.UserOut)
def get_user_by_username(
    username: str,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_username(db, username)
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User doesn't exists")
    
    return db_user

##############################################################################################################

@app.delete('/users/{user_id}', response_model = schemas.UserOut)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    
    deleted_user = crud.delete_user(db,user_id)

    if not deleted_user:
        raise HTTPException(status_code=404, detail="User doesn't exists")
    
    return deleted_user

##############################################################################################################

@app.post("/transactions", response_model=schemas.TransactionOut)
def create_transaction(
    transaction: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_transaction = crud.create_transaction(db, transaction, current_user.id)

    if not db_transaction:
        raise HTTPException(status_code=400, detail=f"User not found: {current_user.id}")

    return db_transaction

##############################################################################################################

@app.get("/transactions/", response_model=list[schemas.TransactionOut])
def get_transactions(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_transactions = crud.get_transactions(db, current_user.id)

    if not db_transactions:
        return []

    return db_transactions

##############################################################################################################

@app.delete("/transactions/{transaction_id}", response_model=schemas.TransactionOut)
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    transaction = crud.get_transaction_by_id(db, transaction_id)

    if not transaction:
        raise HTTPException(status_code=404, detail=f"Transaction ID: {transaction_id} not found")
    if transaction.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this transaction")
    
    db_transactions = crud.delete_transaction(db, transaction_id)

    if not db_transactions:
        raise HTTPException(status_code=404, detail=f"No transactions found against the given Transaction ID: {transaction_id}")

    return db_transactions

##############################################################################################################

@app.get("/verifylogin", response_model = bool)
def verify_login(
    username: str,
    password: str,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_username(db, username)

    if not db_user:
        raise HTTPException(status_code= 401, detail= "Username of Password not correct. Please try again.")

    if verify_password(password, db_user.hashed_password):
        return True
    else:
        raise HTTPException(status_code= 401, detail= "Username of Password not correct. Please try again.")

##############################################################################################################
