from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user, get_user_role, require_roles
from app.models.user import User

from app.schemas.order import OrderCreate, OrderResponse

from app.services.order_service import (
    create_order,
    get_orders,
    get_salesman_orders,
)

router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
)


@router.post("/", response_model=OrderResponse)
def add_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles("ADMIN", "SALESMAN", "RETAILER")
    ),
):
    return create_order(
        db,
        order,
        current_user,
    )


@router.get("/", response_model=list[OrderResponse])
def list_orders(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    role = get_user_role(current_user)

    # ADMIN → See all orders
    if role == "ADMIN":
        return get_orders(
            db,
            current_user,
        )

    # SALESMAN → See only orders created by this salesman
    if role == "SALESMAN":
        return get_salesman_orders(
            db,
            current_user.id,
        )

    # RETAILER → See only their own orders
    if role == "RETAILER":
        return get_orders(
            db,
            current_user,
        )

    return []
@router.get("/salesmen")
def get_salesmen(
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("ADMIN")),
):
    return (
        db.query(User)
        .filter(User.role == "SALESMAN")
        .all()
    )
