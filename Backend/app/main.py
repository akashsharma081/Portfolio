from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.database import Base, engine, SessionLocal
from app.config import settings
from app.services.auth_service import create_default_admin
from app.routers import auth, submissions

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles application startup and shutdown lifespan events.
    Creates SQLite database tables and seeds default admin credentials.
    """
    # Create SQLite database tables if they do not exist
    Base.metadata.create_all(bind=engine)
    
    # Initialize DB Session and seed the default admin
    db = SessionLocal()
    try:
        create_default_admin(db)
    finally:
        db.close()
    yield

# Initialize FastAPI App
app = FastAPI(
    title="Portfolio Admin & Submission Backend",
    description="FastAPI + Pydantic + SQLAlchemy backend managing contact submissions and JWT auth",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS correctly between React Frontend and FastAPI Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router)
app.include_router(submissions.router)

# Custom validator exception handler to return clean error formats to frontend
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = {}
    for error in exc.errors():
        loc = error.get("loc")
        if loc:
            field = str(loc[-1])
            msg = error.get("msg", "Invalid value")
            # Remove redundant Pydantic prefix strings
            if msg.startswith("Value error, "):
                msg = msg.replace("Value error, ", "")
            elif "value_error." in msg:
                msg = msg.replace("value_error.", "")
            errors[field] = msg
            
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Validation Error: Please check form fields.",
            "errors": errors
        }
    )

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "message": "Welcome to the Portfolio Backend API",
        "documentation": "/docs"
    }
