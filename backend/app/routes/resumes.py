"""
Resume routes for uploading and managing resumes.
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
from pathlib import Path

from app.core.security import get_current_user
from app.core.config import settings
from app.db.database import get_db
from app.models.user import User
from app.models.resume import Resume, ResumeSkill
from app.schemas import ResumeUpload, ResumeResponse
from app.services.resume_parser import resume_parser


router = APIRouter(prefix="/api/resumes", tags=["Resumes"])


def validate_file(file: UploadFile) -> None:
    """Validate uploaded file."""
    # Check file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file_ext} not allowed. Allowed types: {settings.ALLOWED_EXTENSIONS}"
        )
    
    # Check file size (read first chunk to estimate)
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to beginning
    
    if file_size > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE / 1024 / 1024}MB"
        )


@router.post("/upload", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload and parse a resume (PDF only for MVP).
    
    The resume will be automatically parsed to extract:
    - Skills
    - Work experience
    - Education
    - Contact information
    """
    # Validate file
    validate_file(file)
    
    # Read file content
    file_content = await file.read()
    
    # Create upload directory if it doesn't exist
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    file_ext = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = upload_dir / unique_filename
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(file_content)
    
    # Parse resume
    try:
        parsed_data = resume_parser.parse(file_content, file.filename)
    except Exception as e:
        # Clean up file if parsing fails
        if file_path.exists():
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse resume: {str(e)}"
        )
    
    # Create resume record
    resume = Resume(
        user_id=current_user.id,
        file_url=str(file_path),
        raw_text=parsed_data.get("raw_text"),
        parsed_data=parsed_data
    )
    
    db.add(resume)
    db.commit()
    db.refresh(resume)
    
    # Save extracted skills
    for skill_data in parsed_data.get("skills", []):
        skill = ResumeSkill(
            resume_id=resume.id,
            skill_name=skill_data.get("skill_name"),
            skill_category=skill_data.get("skill_category")
        )
        db.add(skill)
    
    db.commit()
    
    return resume


@router.get("", response_model=List[ResumeResponse])
async def get_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all resumes for the current user.
    """
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    return resumes


@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific resume by ID.
    """
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    return resume


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a resume.
    """
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Delete file from storage
    if os.path.exists(resume.file_url):
        os.remove(resume.file_url)
    
    # Delete from database
    db.delete(resume)
    db.commit()
    
    return None
