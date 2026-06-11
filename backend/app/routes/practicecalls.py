from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from OICAPIcalls import getlistofcards


from .. import crud, schemas, security
from ..deps import get_db

router = APIRouter(prefix="/cardlist", tags=["auth"])


@router.post("/getList", response_model=schemas.CardListResponse)
def getList(
    request : schemas.CardListRequest
    ):
    
    return getlistofcards(request)
