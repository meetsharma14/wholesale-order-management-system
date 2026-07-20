from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.retailer import Retailer
from app.schemas.order import OrderCreate

def get_orders(db: Session):
    return db.query(Order).all()
def create_order(db: Session, order: OrderCreate):

    retailer = db.query(Retailer).filter(
        Retailer.id == order.retailer_id
    ).first()

    if not retailer:
        raise Exception("Retailer not found")

    total_amount = 0

    new_order = Order(
        retailer_id=order.retailer_id,
        total_amount=0,
    )

    db.add(new_order)
    db.flush()

    for item in order.items:

        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if not product:
            raise Exception(f"Product {item.product_id} not found")

        if product.stock < item.quantity:
            raise Exception(
                f"Insufficient stock for {product.name}"
            )

        line_total = product.price * item.quantity
        total_amount += line_total

        order_item = OrderItem(
            order_id=new_order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=product.price,
        )

        db.add(order_item)

        # Reduce stock
        product.stock -= item.quantity

    new_order.total_amount = total_amount

    db.commit()
    db.refresh(new_order)

    return new_order