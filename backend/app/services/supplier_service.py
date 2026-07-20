from sqlalchemy.orm import Session

from app.models.supplier import Supplier
from app.schemas.supplier import SupplierCreate


def create_supplier(db: Session, supplier: SupplierCreate):
    new_supplier = Supplier(**supplier.model_dump())

    db.add(new_supplier)
    db.commit()
    db.refresh(new_supplier)

    return new_supplier


def get_suppliers(db: Session):
    return db.query(Supplier).all()


def get_supplier(db: Session, supplier_id: str):
    return db.query(Supplier).filter(
        Supplier.id == supplier_id
    ).first()


def update_supplier(
    db: Session,
    supplier_id: str,
    supplier: SupplierCreate,
):
    db_supplier = get_supplier(db, supplier_id)

    if not db_supplier:
        return None

    for key, value in supplier.model_dump().items():
        setattr(db_supplier, key, value)

    db.commit()
    db.refresh(db_supplier)

    return db_supplier


def delete_supplier(db: Session, supplier_id: str):
    supplier = get_supplier(db, supplier_id)

    if not supplier:
        return None

    db.delete(supplier)
    db.commit()

    return True