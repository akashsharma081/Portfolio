import logging
from sqlalchemy.orm import Session
from app.models import User
from app.core.security import verify_password, hash_password
from app.core.config import settings

logger = logging.getLogger(__name__)

def authenticate_user(db: Session, email: str, password: str) -> bool:
    """
    Validate user credentials against stored bcrypt hashes.
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        logger.warning(f"Authentication failed: No user found with email '{email}'")
        return False
        
    result = verify_password(password, user.hashed_password)
    if not result:
        logger.warning(f"Authentication failed: Incorrect password for user '{email}'")
        return False
        
    logger.info(f"User '{email}' successfully authenticated.")
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
        logger.info(f"Default admin user created successfully: {admin_email}")
    else:
        logger.info(f"Admin user validation: default admin already exists.")
