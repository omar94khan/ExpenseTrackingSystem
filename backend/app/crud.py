from sqlalchemy.orm import Session
from .models import Users, Transactions, UserCIF, Banks
from .schemas import UserCreate, TransactionCreate, BankCreate, BankDeleteRequest, CIFCreate, DeleteCIF
from datetime import date
import datetime as dt

def create_user(db: Session, user: UserCreate, hashed_password: str):
    db_user = Users(username=user.username, hashed_password=hashed_password, created_on=user.created_on, isAdmin = False)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def promote_user(db: Session, user_id: int, isAdmin: bool):
    user = db.query(Users).filter(Users.id == user_id).first()
    if user:
        user.isAdmin = isAdmin
        db.commit()
    return user


def get_user(db: Session, user_id: int):
    return db.query(Users).filter(Users.id == user_id).first()


def get_user_by_username(db: Session, username: str):
    return db.query(Users).filter(Users.username == username).first()

def get_all_users(db: Session):
    return db.query(Users).all()

def get_admin(db: Session, user_id: int):
    return db.query(Users).filter(Users.isAdmin == True).filter(Users.id == user_id).first()

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


################################################################################################################################

def add_cif(
        db: Session,
        user_id: int,
        request: CIFCreate
):
    
    user = db.query(Users).filter(Users.id == user_id).first()
    bank_key = request.model_dump()["bank_key"]
    bank_id = db.query(Banks).filter(Banks.bank_key == bank_key).first().id
    if not user or not bank_id:
        return None
    
    cif = request.model_dump()["cif"]
    unique_cif = db.query(UserCIF).filter(UserCIF.bank_id == bank_id).filter(UserCIF.cif_id == cif).first()
    if unique_cif:
        return None

    cif_addition = UserCIF(user_id = user_id, bank_id = bank_id, cif_id=cif)
    db.add(cif_addition)
    db.commit()
    db.refresh(cif_addition)

    return cif_addition

def delete_cif(
        db: Session,
        user_id: int,
        request: DeleteCIF
):
    
    bank_id = db.query(Banks).filter(Banks.bank_key == request.model_dump()["bank_key"]).first().id

    user = db.query(Users).filter(Users.id == user_id).first()
    bank = db.query(Banks).filter(Banks.id == bank_id).first()
    if not user or not bank:
        return None
    
    unique_cif = db.query(UserCIF).filter(UserCIF.bank_id == bank_id).filter(UserCIF.cif_id == request.model_dump()["cif"]).first()
    if not unique_cif:
        return None

    db.delete(unique_cif)
    db.commit()

    return unique_cif

def fetch_cifs(
        db: Session,
        user_id: int
):
    authorized_user = db.query(Users).filter(Users.id == user_id).first()
    if not authorized_user:
        return None
    
    return db.query(UserCIF).filter(UserCIF.user_id == user_id).all()
    
##############################################################################################################################

def add_bank(
        db: Session,
        user_id:int,
        bank_details : BankCreate
):
    
    bank_info = bank_details.model_dump()
    bank_exists = db.query(Banks).filter(Banks.bank_name == bank_info["bank_name"]).first()
    if bank_exists:
        return None
    
    authorized_user = db.query(Users).filter(Users.id == user_id).filter(Users.isAdmin == True).first()
    if not authorized_user:
        return None
    
    bank_addition = Banks(**bank_info)
    db.add(bank_addition)
    db.commit()
    db.refresh(bank_addition)

    return bank_addition

def delete_bank(
        db: Session,
        user_id:int,
        bank_key : BankDeleteRequest
):
    
    
    bank_exists = db.query(Banks).filter(Banks.bank_key == bank_key.bank_key).first()
    if not bank_exists:
        return None
    
    authorized_user = db.query(Users).filter(Users.id == user_id).filter(Users.isAdmin == True).first()
    if not authorized_user:
        return None
    
    
    db.delete(bank_exists)
    db.commit()

    return bank_exists

def fetch_banks(
        db:Session,
        user_id:int
):
    authorized_user = db.query(Users).filter(Users.id == user_id).first()
    if not authorized_user:
        return None
    
    return db.query(Banks).all()