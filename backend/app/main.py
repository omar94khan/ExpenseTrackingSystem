from fastapi import FastAPI
from .database import engine, Base
from .routes import auth, transactions, users

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(transactions.router)
