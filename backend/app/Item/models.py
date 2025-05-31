from sqlalchemy import Column, Integer, String, Numeric, Boolean, Text, ForeignKey, Enum
from app.db.database import Base
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
import enum
from sqlalchemy import Enum


# # ----- Item -----
class Item(Base):
    __tablename__ = "items"

    item_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    item_name = Column(String(20), unique=True, index=True, nullable=False)
    length = Column(Numeric(5, 2), nullable=False)
    width = Column(Numeric(5, 2), nullable=False)
    height = Column(Numeric(5, 2), nullable=False)
    orientation = Column(String(20), default="Face Up")
    remarks = Column(Text, nullable=True)
    is_fragile = Column(Boolean, default=False)
    is_assigned = Column(Boolean, default=False)
    task_id = Column(Integer, ForeignKey("tasks.task_id"), nullable=True)
    order = Column(Integer, nullable=True)
    position = Column(String(50), nullable=True)

    task = relationship("Task", back_populates="items")



