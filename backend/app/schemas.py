from pydantic import BaseModel
from datetime import date
from typing import Optional

# Request Schema
class UserCreate(BaseModel):
    username: str
    password: str  # plaintext for request; you will hash it before saving
    created_on: Optional[date] = None

class TransactionCreate(BaseModel):
    amount: float
    transaction_type: str
    category: Optional[str] = None
    date: date
    description: Optional[str] = None

# Response Schema
class UserOut(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True  # allows SQLAlchemy objects to be returned directly


class TransactionOut(BaseModel):
    id: int
    user_id: int
    amount: float
    transaction_type: str
    category: Optional[str]
    date: date
    description: Optional[str]

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token : str
    token_type : str

class ReportOut(BaseModel):
    number_of_transactions: int
    transaction_month: str
    total_income: float
    total_expense: float
    net_balance: float
    most_common_expense_category: Optional[str]

    class Config:
        orm_mode = True

