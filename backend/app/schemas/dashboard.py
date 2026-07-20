from pydantic import BaseModel

class AdminDashboardResponse(BaseModel):
    total_products: int
    total_categories: int
    total_suppliers: int
    total_retailers: int
    total_salesmen: int
    total_orders: int
    total_payments: int