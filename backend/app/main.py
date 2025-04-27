from fastapi import FastAPI
from .auth.routes import router as auth_router
from .db.database import engine
from .auth import models

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Include routers
app.include_router(auth_router) 