from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
import datetime as dt

from .. import crud, schemas, validations, analysis
from ..deps import get_db, get_current_user

router = APIRouter(prefix="/transactions", tags=["transactions"])

##############################################################################################################

@router.post("/", response_model=schemas.TransactionOut)
def create_transaction(
    transaction: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    
    try:
        validations.validate_transaction_amount(transaction.amount)
    except:
        raise HTTPException(status_code=400, detail="Invalid transaction amount")

    try:
        validations.validate_transaction_type(transaction.transaction_type)
    except:
        raise HTTPException(status_code=400, detail="Invalid transaction type")

    db_transaction = crud.create_transaction(db, transaction, current_user.id)

    if not db_transaction:
        raise HTTPException(status_code=400, detail=f"User not found: {current_user.id}")

    return db_transaction

##############################################################################################################

@router.get("/", response_model=list[schemas.TransactionOut])
def get_transactions(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_transactions = crud.get_transactions(db, current_user.id)

    if not db_transactions:
        return []
    print(db_transactions)
    return db_transactions

##############################################################################################################

@router.delete("/{transaction_id}", response_model=schemas.TransactionOut)
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