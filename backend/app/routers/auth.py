from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.roles import admin_required
from app.schemas.user import PublicUserCreate, UserCreate, UserResponse
from app.services.auth_service import create_managed_user, create_public_user
from app.schemas.user import UserLogin, Token
from app.services.auth_service import login_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register", response_model=UserResponse)
def register(user: PublicUserCreate, db: Session = Depends(get_db)):
    try:
        return create_public_user(db, user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/users", response_model=UserResponse)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required),
):
    try:
        return create_managed_user(db, user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    try:
        return login_user(db, user.email, user.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
