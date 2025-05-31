from pydantic import BaseModel
from typing import Optional, List

class BoxInput(BaseModel):
    item_id: int
    width: float
    height: float
    depth: float
    is_fragile: bool = False

class ContainerInput(BaseModel):
    width: float
    height: float
    depth: float

class OptimizeRequest(BaseModel):
    container: ContainerInput
    boxes: List[BoxInput]

