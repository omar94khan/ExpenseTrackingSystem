from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float, Boolean, DateTime
from sqlalchemy.orm import relationship
from .database import Base


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_on = Column(Date, nullable=True)
    isAdmin = Column(Boolean, nullable = True)
    email = Column(String, nullable=True)
    email_verified = Column(Boolean, nullable = True, default = False)

    transactions = relationship("Transactions", back_populates="transaction_user", cascade = "all, delete-orphan")
    cifs = relationship("UserCIF", back_populates="user_cifs", cascade = "all, delete-orphan")
    otp = relationship("User_OTP", back_populates="user_otp", cascade = "all, delete-orphan")
    accounts = relationship("Accounts", back_populates="user_accounts", cascade = "all, delete-orphan")

class Accounts(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    cif_id = Column(Integer, ForeignKey("UserCIF.id"), nullable=True)
    bank_id = Column(Integer, ForeignKey("config_banks.id"), nullable=True)
    account_name = Column(String, nullable=False)
    account_number = Column(String, nullable=True)
    account_iban = Column(String, nullable=True)

    user_accounts = relationship("Users", back_populates = "accounts")
    all_accounts = relationship("Banks", back_populates = "accounts")
    transfers_out = relationship("Transfers", back_populates = "transfers_out", cascade = "all, delete-orphan")
    transfers_in = relationship("Transfers", back_populates = "transfers_in", cascade = "all, delete-orphan")
    transactions = relationship("Transactions", back_populates = "all_transactions", cascade = "all,delete-orphan")


    

class Transactions(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    transaction_type = Column(String, nullable = False)
    category = Column(String)
    date = Column(Date, nullable = False)
    description = Column(String)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=True)

    transaction_user = relationship("Users", back_populates="transactions")
    all_transactions = relationship("Accounts", back_populates="transactions")
    

class Transfers(Base):
    __tablename__ = "transfers"

    id = Column(Integer, primary_key=True)
    debit_account = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    credit_account = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    amount = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    description = Column(String, nullable=True)

    transfers_out = relationship("Accounts", back_populates = "transfers_out", foreign_keys = [debit_account])
    transfers_in = relationship("Accounts", back_populates = "transfers_in", foreign_keys = [credit_account])


class UserCIF(Base):
    __tablename__ = "UserCIF"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    bank_id = Column(Integer, ForeignKey("config_banks.id"), nullable=False)
    cif_id = Column(String, nullable=False)

    user_cifs = relationship("Users", back_populates="cifs")
    bank_cifs = relationship("Banks", back_populates="all_cifs")

class Banks(Base):
    __tablename__ = "config_banks"

    id = Column(Integer, primary_key=True)
    bank_name = Column(String, nullable=False)
    bank_key = Column(String, nullable=False)
    bank_bic = Column(String, nullable = True)

    all_cifs = relationship("UserCIF", back_populates="bank_cifs", cascade = "all, delete-orphan")
    accounts = relationship("Accounts", back_populates="all_accounts", cascade = "all, delete-orphan")
 

class User_OTP(Base):
    __tablename__ = "user_otp"

    id = Column(Integer, primary_key = True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    email = Column(String, nullable=False)
    otp = Column(String, nullable=False)
    expiry = Column(DateTime, nullable=False)
    false_attempts = Column(Integer, nullable=False, default = 0)

    user_otp = relationship("Users", back_populates="otp")

