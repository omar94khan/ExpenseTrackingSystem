import sqlalchemy
from sqlalchemy.orm import declarative_base, sessionmaker

engine = sqlalchemy.create_engine("sqlite:///transactions.db", echo=True, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
Base = declarative_base()