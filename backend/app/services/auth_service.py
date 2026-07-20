from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import PublicUserCreate, UserCreate, UserRole
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.config import (
    DEFAULT_ADMIN_EMAIL,
    DEFAULT_ADMIN_NAME,
    DEFAULT_ADMIN_PASSWORD,
    DEFAULT_ADMIN_PHONE,
)


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: UserCreate | PublicUserCreate, role: UserRole):
    existing_user = get_user_by_email(db, user.email)

    if existing_user:
        raise ValueError("Email already registered")

    new_user = User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password=hash_password(user.password),
        role=role,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def create_public_user(db: Session, user: PublicUserCreate):
    if user.role == UserRole.ADMIN:
        raise ValueError("Admin accounts must be created by an existing admin")

    return create_user(db, user, user.role)


def create_managed_user(db: Session, user: UserCreate):
    return create_user(db, user, user.role)


def ensure_default_admin(db: Session):
    existing_admin = get_user_by_email(db, DEFAULT_ADMIN_EMAIL)

    if existing_admin:
        return existing_admin

    admin = UserCreate(
        name=DEFAULT_ADMIN_NAME,
        email=DEFAULT_ADMIN_EMAIL,
        phone=DEFAULT_ADMIN_PHONE,
        password=DEFAULT_ADMIN_PASSWORD,
        role=UserRole.ADMIN,
    )

    return create_managed_user(db, admin)


def login_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)

    if not user:
        raise ValueError("Invalid email or password")

    if not verify_password(password, user.password):
        raise ValueError("Invalid email or password")

    access_token = create_access_token(
        data={
            "sub": user.email,
            "role": user.role.value
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
