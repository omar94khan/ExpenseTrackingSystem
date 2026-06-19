from sqlalchemy.orm import Session
from .schemas import CardListRequest
from .models import UserCIF, Banks
from . import config
from datetime import date
import datetime as dt
from fastapi import APIRouter, Depends, HTTPException
import httpx


async def getlistofcards(
        db: Session,
        user_id: int,
        bank_key: str,
        cif_id: str
):

    bank_id = db.query(Banks).filter(Banks.bank_key == bank_key).first().id
    cif = db.query(UserCIF).filter(UserCIF.user_id == user_id).filter(UserCIF.bank_id == bank_id).filter(UserCIF.cif_id == cif_id).first()

    if cif is None:
        raise HTTPException(status_code=404, detail=f"Given CIF not found against user")
    else:
        cif = cif.cif_id

    request = {
        "CIF" : cif,
        "creditOrgNo" : "066",
        "debitOrgNo" : "20010",
        "tranReference" : "12345689"
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            config.CARDLIST_API,
            json=request,
            auth=(config.OIC_USERNAME,config.OIC_PASSWORD)
        )
        
        return response.json()

    