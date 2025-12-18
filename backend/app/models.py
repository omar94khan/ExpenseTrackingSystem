from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float
from sqlalchemy.orm import relationship
from database import Base, engine


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    

class Transactions(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True)
    transaction_user = relationship("Users", backref="transactions")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    transaction_type = Column(String, nullable = False)
    category = Column(String)
    date = Column(Date, nullable = False)
    description = Column(String)

    
 