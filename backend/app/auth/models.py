from sqlalchemy import Column, Integer, String, Enum
import enum
from ..db.database import Base

class UserRole(enum.Enum):
    MANAGER = "manager"
    WORKER = "worker"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password = Column(String(100), nullable=False)  # store hashed password
    role = Column(Enum(UserRole), nullable=False) 