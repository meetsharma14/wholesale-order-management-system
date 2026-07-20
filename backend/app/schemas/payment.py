from pydantic import BaseModel, ConfigDict


class PaymentCreate(BaseModel):
    retailer_id: str
    amount: float
    payment_method: str


class PaymentResponse(BaseModel):
    id: str
    retailer_id: str
    amount: float
    payment_method: str

    model_config = ConfigDict(from_attributes=True)