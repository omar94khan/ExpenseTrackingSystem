from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..deps import get_current_user, get_admin
from ..crud import add_bank, fetch_banks, delete_bank


from .. import schemas
from ..deps import get_db

router = APIRouter(prefix="/banks", tags=["banks"])


@router.post("/create", response_model=schemas.BankCreateResponse)
def createBank(
    request : schemas.BankCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_admin),
    ):

    print("user_id = {} and bank_details = {}".format(current_user.id,request.model_dump()))
    
    response = add_bank(db = db, user_id = current_user.id, bank_details=request)
    
    return response



@router.get("/fetch")
def fetchBank(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
    ):
    
    response = fetch_banks(db = db, user_id = current_user.id)
    
    return response



@router.delete("/delete")
def deleteBank(
    bank_key: schemas.BankDeleteRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_admin)
    ):
    
    response = delete_bank(db = db, user_id = current_user.id, bank_key=bank_key)
    
    return response