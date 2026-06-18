from fastapi import FastAPI
from .database import engine, Base
from .routes import auth, transactions, users, reports, practicecalls, banks
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

@app.get("/")
def read_root():
    return {"message": "Welcome to the Expense Tracking System Backend API! Headover to /docs for the full Swagger UI."}

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(transactions.router)
app.include_router(reports.router)
app.include_router(practicecalls.router)
app.include_router(banks.router)
