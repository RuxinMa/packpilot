from pydantic import BaseModel
from typing import Optional, List

class ContainerCreate(BaseModel):
    width: float
    height: float
    depth: float
    label: Optional[str] = None

class ContainerOut(BaseModel):
    container_id: int
    width: float
    height: float
    depth: float
    label: Optional[str] = None

    class Config:
        from_attributes = True

