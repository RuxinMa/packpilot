from sqlalchemy import Column, Integer, String, Numeric, Boolean, Text, ForeignKey
from app.db.database import Base
from sqlalchemy.orm import relationship

class Item(Base):
    __tablename__ = "items"

    item_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    item_name = Column(String(20), unique=True, index=True, nullable=False)
    width = Column(Numeric(5, 2), nullable=False)
    height = Column(Numeric(5, 2), nullable=False)
    depth = Column(Numeric(5, 2), nullable=False)
    x = Column(Numeric(8, 2), nullable=True)
    y = Column(Numeric(8, 2), nullable=True)
    z = Column(Numeric(8, 2), nullable=True)
    placement_order = Column(Integer, nullable=True)
    orientation = Column(String(20), default="Face Up")
    remarks = Column(Text, nullable=True)
    is_fragile = Column(Boolean, default=False)
    is_assigned = Column(Boolean, default=False)
    task_id = Column(Integer, ForeignKey("tasks.task_id"), nullable=True)

    task = relationship("Task", back_populates="items")



