from typing import Optional

from pydantic import BaseModel, ConfigDict


class ProductCreate(BaseModel):
    name: str
    sku: str
    barcode: Optional[str] = None
    
    category_id: str
    supplier_id: str
    
    brand: str
    
    purchase_price: float
    selling_price: float
    
    gst: int = 18
    
    stock: int = 0
    minimum_stock: int = 0
    
    unit: str
    
    description: Optional[str] = None


class ProductResponse(ProductCreate):
    id: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


