from pydantic import BaseModel
from typing import Optional

class TaskCreate(BaseModel):
    task_name: Optional[str]
    container_id: int
    assigned_to: str
    deadline: Optional[str]

class TaskOut(BaseModel):
    task_id: int
    task_name: str
    worker_id: int
    status: str

    class Config:
        from_orm = True
