import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import config
from ..deps import get_current_user
from ..services import getlistofcards


from .. import crud, schemas, security
from ..deps import get_db

router = APIRouter(prefix="/cardlist", tags=["cards"])


@router.post("/getList", response_model=schemas.CardListResponse)
async def getList(
    bank_key : str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
    ):

    response = await getlistofcards(bank_key=bank_key, db=db, user_id = current_user.id)
    
    return response
