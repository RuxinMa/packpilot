from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.ext.declarative import declarative_base
from app.core.config import DATABASE_URL
from flask import g

if 'postgresql' in DATABASE_URL:
    # PostgreSQL 
    engine = create_engine(DATABASE_URL)
else:
    # SQLite 
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
session = scoped_session(SessionLocal)
Base = declarative_base()

def get_db():
    if 'db' not in g:
        g.db = SessionLocal()
    
    try:
        yield g.db
    finally:
        if 'db' in g:
            g.db.close()

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()