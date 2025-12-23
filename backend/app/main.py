from fastapi import FastAPI
from .database import engine, Base
from .routes import auth, transactions, users
from fastapi.middleware.cors import CORSMiddleware
from .config import CORS_ORIGINS

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS if CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(transactions.router)
