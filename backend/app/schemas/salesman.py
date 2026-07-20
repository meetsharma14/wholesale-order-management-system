from pydantic import BaseModel, ConfigDict
from typing import Optional


class SalesmanCreate(BaseModel):
    name: str
    phone: str
    email: str
    address: Optional[str] = None


class SalesmanResponse(BaseModel):
    id: str
    name: str
    phone: str
    email: str
    address: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)