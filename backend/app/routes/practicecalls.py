import httpx
from fastapi import APIRouter, Depends, HTTPException
from .. import config
from ..deps import get_current_user
from ..services import getlistofcards


from .. import crud, schemas, security
from ..deps import get_db

router = APIRouter(prefix="/cardlist", tags=["cards"])


@router.post("/getList", response_model=schemas.CardListResponse)
async def getList(
    request : schemas.CardListRequest
    ):
    response = await getlistofcards(request)
    return response
