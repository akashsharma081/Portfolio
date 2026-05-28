import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas import UserLogin, Token
from app.services.auth_service import authenticate_user
from app.core.security import create_access_token

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user/admin and return a secure JWT bearer access token.
    """
    logger.info(f"Login attempt initiated for user: {login_data.email}")
    
    is_authenticated = authenticate_user(db, login_data.email, login_data.password)
    if not is_authenticated:
        logger.warning(f"Failed login attempt for user: {login_data.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate the access token using the user's email as the subject
    logger.info(f"Authentication successful for user: {login_data.email}. Generating token.")
    access_token = create_access_token(subject=login_data.email)
    return {"access_token": access_token, "token_type": "bearer"}
