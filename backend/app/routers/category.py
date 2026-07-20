from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.category import CategoryCreate, CategoryResponse
from app.services.category_service import (
    create_category,
    get_categories,
    get_category,
    delete_category,
)

router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
)


@router.post("/", response_model=CategoryResponse)
def add_category(category: CategoryCreate, db: Session = Depends(get_db)):
    try:
        return create_category(db, category)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=list[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return get_categories(db)


@router.get("/{category_id}", response_model=CategoryResponse)
def get_single_category(category_id: str, db: Session = Depends(get_db)):
    category = get_category(db, category_id)

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    return category


@router.delete("/{category_id}")
def remove_category(category_id: str, db: Session = Depends(get_db)):
    category = delete_category(db, category_id)

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    return {"message": "Category deleted successfully"}