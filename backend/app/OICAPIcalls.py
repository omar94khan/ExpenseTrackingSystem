from sqlalchemy.orm import Session
from .schemas import CardListRequest
import config
from datetime import date
import datetime as dt
from fastapi import APIRouter, Depends, HTTPException
import httpx

async def getlistofcards(
        req: CardListRequest
):
    cif = req.CIF
    creditOrgNo = req.creditOrgNo
    debitOrgNo = req.debitOrgNo
    tranReference = req.tranReference

    async with httpx.AsyncClient() as client:
        response = await client.post(
            config.CARDLIST_API,
            json=req,
            auth=(config.OIC_USERNAME,config.OIC_PASSWORD)
        )
        return response.json()

    