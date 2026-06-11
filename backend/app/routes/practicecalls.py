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
    print("Request received in practicecall.pyfor card list with CIF: ", request.CIF)
    response = await getlistofcards(request)
    print("Response received in practicecall.py for card list: ", response)
    return response
