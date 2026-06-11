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
    request = req.model_dump()

    async with httpx.AsyncClient() as client:
        response = await client.post(
            config.CARDLIST_API,
            json=request,
            auth=(config.OIC_USERNAME,config.OIC_PASSWORD)
        )
        return response.json()

    