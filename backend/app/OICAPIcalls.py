from sqlalchemy.orm import Session
from .schemas import CardListRequest
from datetime import date
import datetime as dt
from fastapi import APIRouter, Depends, HTTPException

def getlistofcards(
        req: CardListRequest
):
    cif = req.CIF
    creditOrgNo = req.creditOrgNo
    debitOrgNo = req.debitOrgNo
    tranReference = req.tranReference

    
    