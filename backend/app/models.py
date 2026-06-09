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

    
 