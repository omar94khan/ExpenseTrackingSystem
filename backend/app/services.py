from sqlalchemy.orm import Session
from .schemas import CardListRequest
from . import config
from datetime import date
import datetime as dt
from fastapi import APIRouter, Depends, HTTPException
import httpx

async def getlistofcards(
        req: CardListRequest
):
    print("Request received in services.py for card list with CIF: ", req.CIF)
    request = req.model_dump()
    print("Request body: ", request)

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            config.CARDLIST_API,
            json=request,
            auth=(config.OIC_USERNAME,config.OIC_PASSWORD)
        )
        print("Response received in services.py for card list: ", response.json())
        return response.json()

    