from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float
from sqlalchemy.orm import relationship
from .database import Base


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_on = Column(Date, nullable=True)

    transactions = relationship("Transactions", back_populates="transaction_user", cascade = "all, delete-orphan")
    cifs = relationship("UserCIF", back_populates="user_cifs", cascade = "all, delete-orphan")
    

class Transactions(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    transaction_type = Column(String, nullable = False)
    category = Column(String)
    date = Column(Date, nullable = False)
    description = Column(String)

    transaction_user = relationship("Users", back_populates="transactions")

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
 