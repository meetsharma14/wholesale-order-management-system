from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.category import Category
from app.models.supplier import Supplier
from app.models.retailer import Retailer
from app.models.salesman import Salesman
from app.models.order import Order
from app.models.payment import Payment


def get_admin_dashboard(db: Session):
    return {
        "total_products": db.query(Product).count(),
        "total_categories": db.query(Category).count(),
        "total_suppliers": db.query(Supplier).count(),
        "total_retailers": db.query(Retailer).count(),
        "total_salesmen": db.query(Salesman).count(),
        "total_orders": db.query(Order).count(),
        "total_payments": db.query(Payment).count(),
    }