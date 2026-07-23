from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.dependencies.auth import get_user_role
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.retailer import Retailer
from app.schemas.order import OrderCreate


def get_orders(db: Session, current_user):

    user_role = get_user_role(current_user)

    # ADMIN
    # Admin can see all orders
    if user_role == "ADMIN":
        return db.query(Order).all()

    # RETAILER
    # Retailer can see only their own orders
    if user_role == "RETAILER":

        retailer = (
            db.query(Retailer)
            .filter(
                Retailer.email == current_user.email
            )
            .first()
        )

        if not retailer:
            return []

        return (
            db.query(Order)
            .filter(
                Order.retailer_id == retailer.id
            )
            .all()
        )

    # SALESMAN
    # Salesman can see only orders created by themselves
    if user_role == "SALESMAN":
        return (
            db.query(Order)
            .filter(
                Order.salesman_id == current_user.id
            )
            .all()
        )

    return []

def get_salesman_orders(db: Session, salesman_id: str):
    return (
        db.query(Order)
        .filter(Order.salesman_id == salesman_id)
        .all()
    )

def create_order(
    db: Session,
    order: OrderCreate,
    current_user,
):

    # Check retailer
    retailer = (
        db.query(Retailer)
        .filter(
            Retailer.id == order.retailer_id
        )
        .first()
    )

    if not retailer:
        raise HTTPException(
            status_code=404,
            detail="Retailer not found",
        )

    if (
        get_user_role(current_user) == "RETAILER" and
        retailer.email != current_user.email
    ):
        raise HTTPException(
            status_code=403,
            detail="Retailer accounts can create orders only for themselves",
        )

    # Check order has items
    if not order.items:
        raise HTTPException(
            status_code=400,
            detail="Order must contain at least one item",
        )

    total_amount = 0

    # Create order
    new_order = Order(
        retailer_id=order.retailer_id,
        salesman_id=(
            current_user.id
            if get_user_role(current_user) == "SALESMAN"
            else None
        ),
        total_amount=0,
    )

    db.add(new_order)
    db.flush()

    # Process order items
    for item in order.items:

        product = (
            db.query(Product)
            .filter(
                Product.id == item.product_id
            )
            .first()
        )

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {item.product_id} not found",
            )

        # Check stock
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Insufficient stock for {product.name}. "
                    f"Available stock: {product.stock}"
                ),
            )

        # Calculate total
        line_total = (
            product.selling_price *
            item.quantity
        )

        total_amount += line_total

        # Create order item
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=product.selling_price,
        )

        db.add(order_item)

        # Reduce stock
        product.stock -= item.quantity

    # Update total
    new_order.total_amount = total_amount
    retailer.outstanding_balance = (
        float(retailer.outstanding_balance or 0) + total_amount
    )

    # Save
    db.commit()
    db.refresh(new_order)

    return new_order
