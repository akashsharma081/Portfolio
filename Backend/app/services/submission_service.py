from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.models import Submission
from app.schemas import SubmissionCreate, SubmissionUpdate

def create_submission(db: Session, submission_data: SubmissionCreate) -> Submission:
    """
    Store a new contact form submission in the database.
    """
    db_submission = Submission(
        name=submission_data.name,
        email=submission_data.email,
        phone=submission_data.phone,
        description=submission_data.description,
        status="new"
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission

def get_submissions(db: Session, search: Optional[str] = None, status: Optional[str] = None) -> List[Submission]:
    """
    Fetch submissions from the database with optional searching and status filters.
    Returns latest submissions first.
    """
    query = db.query(Submission)
    
    # Filter by specific status (unless 'all' is requested)
    if status and status.lower() != "all":
        query = query.filter(Submission.status == status.lower())
        
    # Search across text fields (name, email, phone/whatsapp, description)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Submission.name.ilike(search_filter),
                Submission.email.ilike(search_filter),
                Submission.phone.ilike(search_filter),
                Submission.description.ilike(search_filter)
            )
        )
        
    return query.order_by(Submission.id.desc()).all()

def get_submission_by_id(db: Session, submission_id: int) -> Optional[Submission]:
    """
    Fetch a single form submission by its ID.
    """
    return db.query(Submission).filter(Submission.id == submission_id).first()

def update_submission(db: Session, submission_id: int, submission_data: SubmissionUpdate) -> Optional[Submission]:
    """
    Update details (e.g. status, fields) of an existing form submission.
    """
    db_submission = get_submission_by_id(db, submission_id)
    if not db_submission:
        return None
        
    update_dict = submission_data.model_dump(exclude_unset=True)
    
    # Map 'whatsapp' payload key to 'phone' DB column if it comes from frontend
    if 'whatsapp' in update_dict:
        update_dict['phone'] = update_dict.pop('whatsapp')
        
    for key, value in update_dict.items():
        setattr(db_submission, key, value)
        
    db.commit()
    db.refresh(db_submission)
    return db_submission

def delete_submission(db: Session, submission_id: int) -> bool:
    """
    Delete a form submission permanently from the database.
    """
    db_submission = get_submission_by_id(db, submission_id)
    if not db_submission:
        return False
    db.delete(db_submission)
    db.commit()
    return True
