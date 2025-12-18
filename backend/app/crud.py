from sqlalchemy.orm import Session
from models import Users
from schemas import UserCreate

def create_user(db: Session, user: UserCreate, hashed_password: str):
    db_user = Users(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int):
    return db.query(Users).filter(Users.id == user_id).first()


def get_user_by_username(db: Session, username: str):
    return db.query(Users).filter(Users.username == username).first()


def delete_user(db: Session, user_id: int):
    
    user = db.query(Users).filter(Users.id == user_id).all()
    if not user:
        return None
    
    db.delete(user)
    db.commit()
    return user

from models import Transactions
from schemas import TransactionCreate

def create_transaction(db: Session, transaction: TransactionCreate):
    db_transaction = Transactions(**transaction.model_dump())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def get_transactions(db: Session, user_id: int):
    return db.query(Transactions).filter(Transactions.user_id == user_id).all()

def delete_transaction(db: Session, transaction_id: int):
    
    transaction = db.query(Transactions).filter(Transactions.id == transaction_id).all()
    if not transaction:
        return None
    
    db.delete(transaction)
    db.commit()
    return transaction