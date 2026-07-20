from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.roles import admin_required

from app.schemas.retailer import RetailerCreate, RetailerResponse
from app.services.retailer_service import (
    create_retailer,
    get_retailers,
    get_retailer,
    update_retailer,
    delete_retailer,
)

router = APIRouter(
    prefix="/retailers",
    tags=["Retailers"],
)


@router.post("/", response_model=RetailerResponse)
def add_retailer(
    retailer: RetailerCreate,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required),
):
    return create_retailer(db, retailer)


@router.get("/", response_model=list[RetailerResponse])
def list_retailers(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_retailers(db)


@router.get("/{retailer_id}", response_model=RetailerResponse)
def get_single_retailer(
    retailer_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    retailer = get_retailer(db, retailer_id)

    if not retailer:
        raise HTTPException(status_code=404, detail="Retailer not found")

    return retailer


@router.put("/{retailer_id}", response_model=RetailerResponse)
def update_single_retailer(
    retailer_id: str,
    retailer: RetailerCreate,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required),
):
    updated = update_retailer(db, retailer_id, retailer)

    if not updated:
        raise HTTPException(status_code=404, detail="Retailer not found")

    return updated


@router.delete("/{retailer_id}")
def delete_single_retailer(
    retailer_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required),
):
    deleted = delete_retailer(db, retailer_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Retailer not found")

    return {"message": "Retailer deleted successfully"}