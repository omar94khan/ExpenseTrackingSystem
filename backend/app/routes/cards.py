import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import config
from ..deps import get_current_user
from ..services import getlistofcards
from fastapi import status


from .. import crud, schemas, security
from ..deps import get_db

router = APIRouter(prefix="/cardlist", tags=["cards"])


@router.get("/getList", response_model=schemas.CardListResponse)
async def getList(
    bank_key : str,
    cif: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
    ):

    response = await getlistofcards(bank_key=bank_key, cif_id = cif, db=db, user_id = current_user.id)
    
    return response
