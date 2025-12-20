from sqlalchemy.orm import Session
from .models import Users, Transactions
from .schemas import UserCreate, TransactionCreate
from datetime import date
import datetime as dt

def create_user(db: Session, user: UserCreate, hashed_password: str):
    db_user = Users(username=user.username, hashed_password=hashed_password, created_on=user.created_on)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int):
    return db.query(Users).filter(Users.id == user_id).first()


def get_user_by_username(db: Session, username: str):
    return db.query(Users).filter(Users.username == username).first()


def delete_user(db: Session, user_id: int):
    
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        return None
    
    db.delete(user)
    db.commit()
    return user


def create_transaction(db: Session, transaction: TransactionCreate, user_id: int):
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        return None

    db_transaction = Transactions(user_id = user_id, **transaction.model_dump())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def get_transactions(db: Session, user_id: int):
    return db.query(Transactions).filter(Transactions.user_id == user_id).all()

def delete_transaction(db: Session, transaction_id: int):
    
    transaction = db.query(Transactions).filter(Transactions.id == transaction_id).first()
    if not transaction:
        return None
    
    db.delete(transaction)
    db.commit()
    return transaction

def get_transaction_by_id(db: Session, transaction_id: int):
    return db.query(Transactions).filter(Transactions.id == transaction_id).first()

def fetch_report(
        db: Session, 
        user_id: int, 
        from_date: date = date.today() - dt.timedelta(days=30), 
        to_date: date = date.today()
        ):
    
    print("Transaction date that the fetch report function received :", db.query(Transactions).all(), from_date, to_date)

    transactions = db.query(Transactions).filter(
        Transactions.user_id == user_id,
        Transactions.date >= from_date,
        Transactions.date <= to_date
    ).all()
    print("Transactions fetched for Report :", transactions)
    return transactions
