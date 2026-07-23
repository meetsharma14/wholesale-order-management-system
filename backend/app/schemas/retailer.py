from pydantic import BaseModel, Field
from typing import Optional


class RetailerCreate(BaseModel):
    shop_name: str
    owner_name: str
    phone: str
    email: Optional[str] = None
    gst_number: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    credit_limit: float = Field(default=0, ge=0)


class RetailerResponse(RetailerCreate):
    id: str
    outstanding_balance: float
    is_active: bool

    class Config:
        from_attributes = True
