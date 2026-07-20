from pydantic import BaseModel
from uuid import UUID


class SupplierCreate(BaseModel):
    name: str
    phone: str
    email: str
    address: str


class SupplierResponse(BaseModel):
    id: UUID
    name: str
    phone: str
    email: str
    address: str

    class Config:
        from_attributes = True