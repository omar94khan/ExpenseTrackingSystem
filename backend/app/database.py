import sqlalchemy
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import DATABASE_URL
from pathlib import Path

engine = sqlalchemy.create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
Base = declarative_base()