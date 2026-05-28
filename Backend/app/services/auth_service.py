from sqlalchemy.orm import Session
from app.models import User
from app.auth import verify_password, hash_password
from app.config import settings

def authenticate_user(db: Session, email: str, password: str) -> bool:
    """
    Validate user credentials against stored bcrypt hashes.
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return True

def create_default_admin(db: Session):
    """
    Check if the default admin exists. If not, auto-create using .env credentials.
    """
    admin_email = settings.ADMIN_EMAIL
    admin = db.query(User).filter(User.email == admin_email).first()
    if not admin:
        hashed_pw = hash_password(settings.ADMIN_PASSWORD)
        default_admin = User(
            email=admin_email,
            hashed_password=hashed_pw,
            is_active=True
        )
        db.add(default_admin)
        db.commit()
        db.refresh(default_admin)
        print(f"[Startup] Default admin user created successfully: {admin_email}")
    else:
        print(f"[Startup] Admin user already exists: {admin_email}")
