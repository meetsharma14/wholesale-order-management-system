import getpass

from app.database import SessionLocal
from app.schemas.user import UserCreate, UserRole
from app.services.auth_service import create_managed_user, get_user_by_email


def main():
    db = SessionLocal()

    try:
        email = input("Admin email: ").strip()

        if get_user_by_email(db, email):
            print("User already exists.")
            return

        user = UserCreate(
            name=input("Admin name: ").strip(),
            email=email,
            phone=input("Phone: ").strip(),
            password=getpass.getpass("Password: "),
            role=UserRole.ADMIN,
        )

        create_managed_user(db, user)
        print("Admin user created.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
