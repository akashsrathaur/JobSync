"""
Application routes for tracking job applications.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.models.job import Job
from app.models.application import Application
from app.schemas import ApplicationCreate, ApplicationUpdate, ApplicationResponse


router = APIRouter(prefix="/api/applications", tags=["Applications"])


@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_application(
    app_data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submit a job application.
    
    Marks a job as applied and tracks the application status.
    """
    # Check if job exists
    job = db.query(Job).filter(Job.id == app_data.job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Check if already applied
    existing_app = db.query(Application).filter(
        Application.user_id == current_user.id,
        Application.job_id == app_data.job_id
    ).first()
    
    if existing_app:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied to this job"
        )
    
    # Create application
    application = Application(
        user_id=current_user.id,
        job_id=app_data.job_id,
        status="applied"
    )
    
    db.add(application)
    db.commit()
    db.refresh(application)
    
    return application


@router.get("", response_model=List[ApplicationResponse])
async def get_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all job applications for the current user.
    """
    applications = db.query(Application).filter(
        Application.user_id == current_user.id
    ).order_by(Application.applied_at.desc()).all()
    
    return applications


@router.patch("/{application_id}", response_model=ApplicationResponse)
async def update_application(
    application_id: str,
    update_data: ApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update application status.
    
    Valid statuses: applied, interviewing, rejected, accepted
    """
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Update status
    application.status = update_data.status
    
    db.commit()
    db.refresh(application)
    
    return application
