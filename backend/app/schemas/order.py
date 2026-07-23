from pydantic import BaseModel, Field


class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int = Field(..., gt=0)


class OrderCreate(BaseModel):
    retailer_id: str
    items: list[OrderItemCreate]


class OrderItemResponse(BaseModel):
    product_id: str
    quantity: int
    price: float

    model_config = {
        "from_attributes": True
    }


class OrderResponse(BaseModel):
    id: str
    retailer_id: str
    total_amount: float
    items: list[OrderItemResponse]

    model_config = {
        "from_attributes": True
    }
