from pydantic import BaseModel, field_validator, ConfigDict
from datetime import date
from typing import Optional

# Login JSON Schema
class LoginRequest(BaseModel):
    username: str
    password: str

# Request Schema

class CardListRequest(BaseModel):
    CIF : str
    creditOrgNo : Optional[str] = "066"
    debitOrgNo : Optional[str] = "20010"
    tranReference : Optional[str] = "123516235"

class UserCreate(BaseModel):
    username: str
    password: str  # plaintext for request; you will hash it before saving
    created_on: Optional[date] = None
    isAdmin: Optional[bool] = False

class TransactionCreate(BaseModel):
    amount: float
    transaction_type: str
    category: Optional[str] = None
    date: date
    description: Optional[str] = None

    @field_validator("transaction_type")
    @classmethod
    def normalize_transaction_type(cls, v):
        if not isinstance(v, str):
            raise ValueError("transaction_type must be a string")
        if v is None:
            raise ValueError("transaction_type cannot be null")
        if v.lower() not in {"income", "expense","transfer"}:
            raise ValueError("transaction_type must be 'income' or 'expense' or 'transfer'")
        return v.lower().capitalize()
    
    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError("Amount must be greater than 0")
        return v

# Response Schema
class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # allows SQLAlchemy objects to be returned directly

    id: int
    username: str
    isAdmin: Optional[bool]

    # class Config:
    #     orm_mode = True  # allows SQLAlchemy objects to be returned directly

# Response Schema
class UserOutAdmin(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # allows SQLAlchemy objects to be returned directly

    id: int
    username: str
    created_on: Optional[date]
    isAdmin: Optional[bool]

    # class Config:
    #     orm_mode = True  # allows SQLAlchemy objects to be returned directly

class TransactionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # allows SQLAlchemy objects to be returned directly

    id: int
    user_id: int
    amount: float
    transaction_type: str
    category: Optional[str]
    date: date
    description: Optional[str]

    # class Config:
    #     orm_mode = True

class Token(BaseModel):
    access_token : str
    token_type : str

class ReportOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # allows SQLAlchemy objects to be returned directly

    number_of_transactions: int
    transaction_month: str
    total_income: float
    total_expense: float
    net_balance: float
    most_common_expense_category: Optional[str]

    # class Config:
    #     orm_mode = True

class CardListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # allows SQLAlchemy objects to be returned directly

    debitCards : dict
    creditCards : dict


class BankCreate(BaseModel):
    # model_config = ConfigDict(from_attributes=True)  # allows SQLAlchemy objects to be returned directly

    bank_name : str
    bank_key : str
    bank_bic : Optional[str]

    @field_validator("bank_name")
    @classmethod
    def normalize_bank_name(cls, v):
        return v.upper()
    
    @field_validator("bank_key")
    @classmethod
    def normalize_bank_key(cls, v):
        return v.upper()
    
    @field_validator("bank_bic")
    @classmethod
    def normalize_bank_bic(cls, v):
        if v is not None and v != "":
            return v.upper()
    
    
class BankCreateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # allows SQLAlchemy objects to be returned directly

    id:int
    bank_key: str
    bank_name: str
    bank_bic: Optional[str]
    
class BankDeleteRequest(BaseModel):
    bank_key: str


class CIFCreate(BaseModel):
    bank_key : str
    cif : str
    
    @field_validator("bank_key")
    @classmethod
    def normalize_bank_key(cls, v):
        return v.upper()
    
class CIFCreateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    cif_id: str
    user_id: int
    bank_id: int



class DeleteCIF(BaseModel):
    bank_key : str
    cif : str
    
    @field_validator("bank_key")
    @classmethod
    def normalize_bank_key(cls, v):
        return v.upper()
