from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..deps import get_verified_user
from ..crud import add_cif, fetch_cifs, delete_cif
from .. import schemas
from ..deps import get_db

router = APIRouter(prefix="/cifs", tags=["cifs"])


@router.post("/create", response_model=schemas.CIFCreateResponse)
def createCIF(
    request : schemas.CIFCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_verified_user)
    ):

    response = add_cif(db = db, user_id = current_user.id, request=request)
    
    return response



@router.get("/fetch")
def fetchCIF(
    db: Session = Depends(get_db),
    current_user = Depends(get_verified_user)
    ):
    
    response = fetch_cifs(db = db, user_id = current_user.id)
    
    return response



@router.delete("/delete")
def deleteCIF(
    request: schemas.DeleteCIF,
    db: Session = Depends(get_db),
    current_user = Depends(get_verified_user)
    ):
    
    response = delete_cif(db = db, user_id = current_user.id, request = request)
    
    return response