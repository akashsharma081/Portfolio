import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.schemas import SubmissionCreate, SubmissionUpdate, SubmissionResponse
from app.dependencies import get_current_user
from app.models import User
import app.services.submission_service as submission_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/submissions", tags=["Submissions"])

@router.post("/", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
def create_submission(submission_data: SubmissionCreate, db: Session = Depends(get_db)):
    """
    Public Endpoint: Submit the contact form. Creates a new enquiry.
    """
    logger.info(f"Creating new submission from: {submission_data.email}")
    return submission_service.create_submission(db, submission_data)

@router.get("/", response_model=List[SubmissionResponse])
def get_submissions(
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Admin-Only Endpoint: Retrieve all contact form submissions.
    Supports search querying and status filtering.
    """
    logger.info(f"Admin {current_user.email} fetching submissions with status={status}, search={search}")
    return submission_service.get_submissions(db, search=search, status=status)

@router.put("/{submission_id}", response_model=SubmissionResponse)
def update_submission(
    submission_id: int,
    submission_data: SubmissionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Admin-Only Endpoint: Update the details or status of an existing submission.
    """
    logger.info(f"Admin {current_user.email} updating submission ID {submission_id}")
    db_submission = submission_service.update_submission(db, submission_id, submission_data)
    if not db_submission:
        logger.warning(f"Submission ID {submission_id} not found for update")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Submission with ID {submission_id} not found"
        )
    return db_submission

@router.delete("/{submission_id}", status_code=status.HTTP_200_OK)
def delete_submission(
    submission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Admin-Only Endpoint: Permanently delete a contact form submission.
    """
    logger.info(f"Admin {current_user.email} deleting submission ID {submission_id}")
    success = submission_service.delete_submission(db, submission_id)
    if not success:
        logger.warning(f"Submission ID {submission_id} not found for deletion")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Submission with ID {submission_id} not found"
        )
    return {"success": True, "message": f"Submission {submission_id} deleted successfully"}
