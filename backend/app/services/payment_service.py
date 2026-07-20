from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.schemas.payment import PaymentCreate


def create_payment(db: Session, payment: PaymentCreate):
    new_payment = Payment(**payment.model_dump())

    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)

    return new_payment


def get_payments(db: Session):
    return db.query(Payment).all()


def get_payment(db: Session, payment_id: str):
    return db.query(Payment).filter(
        Payment.id == payment_id
    ).first()


def update_payment(
    db: Session,
    payment_id: str,
    payment: PaymentCreate,
):
    db_payment = get_payment(db, payment_id)

    if not db_payment:
        return None

    for key, value in payment.model_dump().items():
        setattr(db_payment, key, value)

    db.commit()
    db.refresh(db_payment)

    return db_payment


def delete_payment(db: Session, payment_id: str):
    payment = get_payment(db, payment_id)

    if not payment:
        return None

    db.delete(payment)
    db.commit()

    return True