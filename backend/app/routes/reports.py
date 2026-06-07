from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
import datetime as dt

from .. import crud, schemas, validations, analysis
from ..deps import get_db, get_current_user

router = APIRouter(prefix="/reports", tags=["reports"])

##############################################################################################################

@router.get("/fetch-transaction-report/")
def get_report(
    from_date: date = date.today() - dt.timedelta(days=30),
    to_date: date = date.today(),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    transactions = crud.fetch_report(db, current_user.id, from_date, to_date)

    if not transactions:
        return []
    
    
    # Analyze transactions
    
    output = analysis.analyze_report(transactions)

    return output

##############################################################################################################



