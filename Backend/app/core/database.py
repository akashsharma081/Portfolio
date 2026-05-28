from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

# Create database engine
# For SQLite, we allow multithreading using check_same_thread: False
# and attach performance optimization hooks.
if settings.DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        settings.DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )
    
    # Enable WAL mode and other optimizations for SQLite
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.execute("PRAGMA cache_size=-20000")  # ~20MB cache
        cursor.execute("PRAGMA temp_store=MEMORY")   # temp tables/indices in memory
        cursor.close()
else:
    engine = create_engine(settings.DATABASE_URL)

# Configure session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declare declarative base for modern SQLAlchemy 2.0 models
class Base(DeclarativeBase):
    pass

# Database session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
