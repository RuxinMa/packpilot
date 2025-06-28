from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
import enum
from datetime import datetime
from app.db.database import Base
from sqlalchemy.orm import relationship

class TaskStatus(enum.Enum):
    Assigned = "Assigned"
    Completed = "Completed"

class Task(Base):
    __tablename__ = "tasks"

    task_id = Column(Integer, primary_key=True, index=True)
    task_name = Column(String(100), nullable=False)
    container_id = Column(Integer, ForeignKey("containers.container_id"))
    assigned_to = Column(String(50), nullable=False)
    manager_name = Column(String(50), nullable=False)
    status = Column(Enum(TaskStatus), default=TaskStatus.Assigned)
    deadline = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("Item", back_populates="task")

