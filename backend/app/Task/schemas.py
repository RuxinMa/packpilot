from pydantic import BaseModel
from typing import Optional, List

# ----- Item -----
# class ItemCreate(BaseModel):
#     length: float
#     width: float
#     height: float
#     orientation: Optional[str] = "Face Up"
#     remarks: Optional[str] = None

# class ItemOut(ItemCreate):
#     item_id: int
#     item_name: str

#     class Config:
#         from_orm = True

# ----- Task -----
# class TaskCreate(BaseModel):
#     worker_id: int
#     item_ids: List[int]
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

# # ----- Container -----
# class ContainerCreate(BaseModel):
#     length: float
#     width: float
#     height: float
#     label: Optional[str] = None

# class ContainerOut(ContainerCreate):
#     container_id: int

#     class Config:
#         from_orm = True
