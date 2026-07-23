from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import (
    get_current_user,
    require_roles,
    admin_required,
)

from app.schemas.payment import (
    PaymentCreate,
    PaymentResponse,
)

from app.services.payment_service import (
    create_payment,
    get_payments,
    get_payment,
    update_payment,
    delete_payment,
)

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)


# ADMIN + SALESMAN can create payments
@router.post("/", response_model=PaymentResponse)
def add_payment(
    payment: PaymentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles("ADMIN", "SALESMAN")
    ),
):
    return create_payment(db, payment)


# ADMIN + SALESMAN + RETAILER can view payments
@router.get("/", response_model=list[PaymentResponse])
def list_payments(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_payments(db, current_user)


# Any logged-in user can view a specific payment
@router.get("/{payment_id}", response_model=PaymentResponse)
def get_single_payment(
    payment_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    payment = get_payment(db, payment_id)

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    return payment


# ONLY ADMIN can update payments
@router.put("/{payment_id}", response_model=PaymentResponse)
def update_single_payment(
    payment_id: str,
    payment: PaymentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required),
):
    updated = update_payment(
        db,
        payment_id,
        payment,
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    return updated


# ONLY ADMIN can delete payments
@router.delete("/{payment_id}")
def delete_single_payment(
    payment_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required),
):
    deleted = delete_payment(
        db,
        payment_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    return {
        "message": "Payment deleted successfully"
    }
