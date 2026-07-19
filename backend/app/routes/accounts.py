from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..deps import get_current_user, get_admin
from ..crud import create_account


from .. import schemas
from ..deps import get_db

router = APIRouter(prefix="/accounts", tags=["accounts"])


@router.post("/create", response_model=schemas.AccountCreateOut)
def createBank(
    request : schemas.AccountsCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_admin),
    ):
    
    response = create_account(db = db, user_id = current_user.id, payload=request)

    if response == "account_exists":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account already exists for user.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    return response



# @router.get("/fetch")
# def fetchBank(
#     db: Session = Depends(get_db),
#     current_user = Depends(get_current_user)
#     ):
    
#     response = fetch_banks(db = db, user_id = current_user.id)
    
#     return response



# @router.delete("/delete")
# def deleteBank(
#     bank_key: schemas.BankDeleteRequest,
#     db: Session = Depends(get_db),
#     current_user = Depends(get_admin)
#     ):
    
#     response = delete_bank(db = db, user_id = current_user.id, bank_key=bank_key)
    
#     return response