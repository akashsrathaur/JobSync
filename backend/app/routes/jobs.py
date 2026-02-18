"""
Job routes for browsing jobs, getting matches, and managing saved jobs.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.models.job import Job
from app.models.resume import Resume, Preference
from app.models.match import Match
from app.models.application import SavedJob
from app.schemas import JobResponse, JobWithMatch, SavedJobResponse
from app.services.matcher import job_matcher
from app.services.job_fetcher import get_mock_jobs


router = APIRouter(prefix="/api/jobs", tags=["Jobs"])


def seed_jobs_if_empty(db: Session) -> None:
    """Seed database with mock jobs if empty."""
    job_count = db.query(Job).count()
    if job_count == 0:
        mock_jobs = get_mock_jobs()
        for job_data in mock_jobs:
            job = Job(**job_data)
            db.add(job)
        db.commit()


@router.get("", response_model=List[JobResponse])
async def get_jobs(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    location: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all job listings with pagination.
    
    - **page**: Page number (default: 1)
    - **page_size**: Items per page (default: 20, max: 100)
    - **location**: Filter by location (optional)
    """
    # Seed jobs if database is empty
    seed_jobs_if_empty(db)
    
    # Build query
    query = db.query(Job)
    
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    
    # Apply pagination
    offset = (page - 1) * page_size
    jobs = query.order_by(Job.posted_at.desc()).offset(offset).limit(page_size).all()
    
    return jobs


@router.get("/matched", response_model=List[JobWithMatch])
async def get_matched_jobs(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    min_score: float = Query(0, ge=0, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get job listings with AI-calculated match scores.
    
    Jobs are ranked by match score (highest first).
    
    - **page**: Page number (default: 1)
    - **page_size**: Items per page (default: 20, max: 100)
    - **min_score**: Minimum match score filter (default: 0)
    """
    # Seed jobs if database is empty
    seed_jobs_if_empty(db)
    
    # Get user's most recent resume
    resume = db.query(Resume).filter(
        Resume.user_id == current_user.id
    ).order_by(Resume.uploaded_at.desc()).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload a resume first to see matched jobs"
        )
    
    # Get user preferences
    preferences = db.query(Preference).filter(
        Preference.user_id == current_user.id
    ).first()
    
    # Get all jobs
    all_jobs = db.query(Job).all()
    
    # Calculate match scores for each job
    matched_jobs = []
    for job in all_jobs:
        # Check if match already exists and is recent (within 24 hours)
        existing_match = db.query(Match).filter(
            Match.user_id == current_user.id,
            Match.job_id == job.id
        ).order_by(Match.calculated_at.desc()).first()
        
        if existing_match and (datetime.utcnow() - existing_match.calculated_at).total_seconds() < 86400:
            # Use existing match
            match_result = {
                "match_score": existing_match.match_score,
                "score_breakdown": existing_match.score_breakdown
            }
        else:
            # Calculate new match score
            match_result = job_matcher.calculate_match_score(
                resume_data=resume.parsed_data,
                job_data={
                    "required_skills": job.required_skills or [],
                    "description": job.description,
                    "experience_required": job.experience_required,
                    "location": job.location,
                    "salary_min": job.salary_min,
                    "salary_max": job.salary_max
                },
                preferences=preferences.__dict__ if preferences else None
            )
            
            # Save match to database
            match = Match(
                user_id=current_user.id,
                job_id=job.id,
                match_score=match_result["match_score"],
                score_breakdown=match_result["score_breakdown"]
            )
            db.add(match)
        
        # Filter by minimum score
        if match_result["match_score"] >= min_score:
            job_dict = {
                "id": job.id,
                "title": job.title,
                "company": job.company,
                "description": job.description,
                "location": job.location,
                "salary_min": job.salary_min,
                "salary_max": job.salary_max,
                "experience_required": job.experience_required,
                "required_skills": job.required_skills,
                "source": job.source,
                "external_url": job.external_url,
                "posted_at": job.posted_at,
                "match_score": match_result["match_score"],
                "score_breakdown": match_result["score_breakdown"]
            }
            matched_jobs.append(job_dict)
    
    db.commit()
    
    # Sort by match score (descending)
    matched_jobs.sort(key=lambda x: x["match_score"], reverse=True)
    
    # Apply pagination
    offset = (page - 1) * page_size
    paginated_jobs = matched_jobs[offset:offset + page_size]
    
    return paginated_jobs


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a specific job.
    """
    job = db.query(Job).filter(Job.id == job_id).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    return job


@router.post("/{job_id}/save", response_model=SavedJobResponse, status_code=status.HTTP_201_CREATED)
async def save_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Save a job to your saved jobs list.
    """
    # Check if job exists
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Check if already saved
    existing_saved = db.query(SavedJob).filter(
        SavedJob.user_id == current_user.id,
        SavedJob.job_id == job_id
    ).first()
    
    if existing_saved:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job already saved"
        )
    
    # Save job
    saved_job = SavedJob(
        user_id=current_user.id,
        job_id=job_id
    )
    
    db.add(saved_job)
    db.commit()
    db.refresh(saved_job)
    
    return saved_job


@router.delete("/{job_id}/save", status_code=status.HTTP_204_NO_CONTENT)
async def unsave_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Remove a job from your saved jobs list.
    """
    saved_job = db.query(SavedJob).filter(
        SavedJob.user_id == current_user.id,
        SavedJob.job_id == job_id
    ).first()
    
    if not saved_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved job not found"
        )
    
    db.delete(saved_job)
    db.commit()
    
    return None


@router.get("/saved/list", response_model=List[SavedJobResponse])
async def get_saved_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all saved jobs for the current user.
    """
    saved_jobs = db.query(SavedJob).filter(
        SavedJob.user_id == current_user.id
    ).order_by(SavedJob.saved_at.desc()).all()
    
    return saved_jobs
