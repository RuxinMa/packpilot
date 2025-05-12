from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.ext.declarative import declarative_base
from backend.app.core.config import DATABASE_URL
from flask import g

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
session = scoped_session(SessionLocal)

Base = declarative_base()

# Database session generator compatible with Flask
def get_db():
    if 'db' not in g:
        g.db = SessionLocal()
    
    try:
        yield g.db
    finally:
        if 'db' in g:
            g.db.close()

# Flask teardown function - register this with app context
def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close() 