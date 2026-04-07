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
from app.services.job_fetcher import fetch_live_jobs, get_fallback_sample_job_records


router = APIRouter(prefix="/api/jobs", tags=["Jobs"])


async def ensure_live_jobs(db: Session, query: str = "Software Developer", location: str = "") -> None:
    """Fetch live jobs from API and seed database if we need more variety."""
    search_query = f"{query} {location}".strip()
    
    try:
        live_jobs = await fetch_live_jobs(search_query, num_pages=1)
    except Exception as e:
        print(f"Live job fetch failed: {e}")
        live_jobs = get_fallback_sample_job_records()
        
    for job_data in live_jobs:
        # Check if job exists to avoid duplicates
        existing = db.query(Job).filter(
            Job.title == job_data["title"], 
            Job.company == job_data["company"]
        ).first()
        
        if not existing:
            job = Job(**job_data)
            db.add(job)
            
    db.commit()


@router.get("", response_model=List[JobResponse])
async def get_jobs(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    location: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # Assuming auth required
):
    """
    Get all job listings with pagination.
    """
    # If DB is empty or very small, fetch some live jobs
    total_jobs_registered = db.query(Job).count()
    if total_jobs_registered < 10:
        await ensure_live_jobs(db, "Engineer", location or "")
    
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
    """
    # Get user's most recent resume
    resume = db.query(Resume).filter(
        Resume.user_id == current_user.id
    ).order_by(Resume.uploaded_at.desc()).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload a resume first to see matched jobs"
        )
        
    # Attempt to derive a targeted live job search query from the resume
    search_query = "Software Engineer"
    parsed = resume.parsed_data or {}
    skills = parsed.get("skills", [])
    if skills:
        top_skill = skills[0].get("skill_name") if isinstance(skills[0], dict) else skills[0]
        if top_skill:
            search_query = f"{top_skill} Developer"
            
    # Fetch live jobs to ensure our database has relevant fresh matches
    # (We could check if we did this recently to save API calls)
    recent_jobs_count = db.query(Job).filter(Job.title.ilike(f"%{search_query.split()[0]}%")).count()
    if recent_jobs_count < 5:
        await ensure_live_jobs(db, search_query)
    
    # Get user preferences
    preferences = db.query(Preference).filter(
        Preference.user_id == current_user.id
    ).first()
    
    # Get all jobs (or filter by criteria if DB gets too large)
    all_jobs = db.query(Job).order_by(Job.posted_at.desc()).limit(100).all()
    
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
            match_result = job_matcher.calculate_match_score(
                resume_data=resume.parsed_data,
                job_data={
                    "id": job.id,
                    "title": job.title,
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
            job_mapping_dict = {
                "id": job.id,
                "title": job.title,
                "company": job.company,
                "description": job.description,
                "location": job.location,
                "salary_min": job.salary_min,
                "salary_max": job.salary_max,
                "experience_required": str(job.experience_required) if job.experience_required else None,
                "required_skills": job.required_skills,
                "source": job.source,
                "external_url": job.external_url,
                "posted_at": job.posted_at,
                "match_score": match_result["match_score"],
                "score_breakdown": match_result["score_breakdown"]
            }
            matched_jobs.append(job_mapping_dict)
    
    db.commit()
    
    # Sort by match score (descending)
    matched_jobs.sort(key=lambda x: x["match_score"], reverse=True)
    
    # Apply pagination
    offset = (page - 1) * page_size
    paginated_jobs = matched_jobs[offset:offset + page_size]
    
    return paginated_jobs


@router.get("/search", response_model=List[JobWithMatch])
async def search_jobs(
    q: str = Query(..., min_length=1),
    location: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Search for jobs globally across multiple platforms and get real-time matches.
    """
    # 1. Fetch live jobs based on the query - Increase pages for more variety
    await ensure_live_jobs(db, q, location or "")
    if location: # If searching specifically, try a second page for deeper variety
        await ensure_live_jobs(db, q, location) 
    
    # 2. Get user's resume for matching
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
    
    # 3. Pull jobs from DB related to search (both new and old)
    search_terms = q.split()
    query_filters = [Job.title.ilike(f"%{term}%") for term in search_terms]
    
    # Increase limit to 100 for better randomization pool
    jobs = db.query(Job).filter(*query_filters).order_by(Job.posted_at.desc()).limit(100).all()
    
    # 4. Calculate matches
    matched_results = []
    import random
    
    for job in jobs:
        match_result = job_matcher.calculate_match_score(
            resume_data=resume.parsed_data,
            job_data={
                "id": job.id,
                "title": job.title,
                "required_skills": job.required_skills or [],
                "description": job.description,
                "experience_required": job.experience_required,
                "location": job.location,
                "salary_min": job.salary_min,
                "salary_max": job.salary_max
            },
            preferences=preferences.__dict__ if preferences else None
        )
        
        matched_results.append({
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "description": job.description,
            "location": job.location,
            "salary_min": job.salary_min,
            "salary_max": job.salary_max,
            "experience_required": str(job.experience_required) if job.experience_required else None,
            "required_skills": job.required_skills,
            "source": job.source,
            "external_url": job.external_url,
            "posted_at": job.posted_at,
            "match_score": match_result["match_score"],
            "score_breakdown": match_result["score_breakdown"]
        })
        
    # Sort by match score
    matched_results.sort(key=lambda x: x["match_score"], reverse=True)
    
    # Final variety polish: If we have many high matches, slightly shuffle the top 10 to feel "fresh"
    if len(matched_results) > 10:
        top_slice = matched_results[:10]
        random.shuffle(top_slice)
        matched_results = top_slice + matched_results[10:]
    
    return matched_results


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
    
    # Quick fix for response model
    job_resp = job.__dict__.copy()
    if job_resp.get("experience_required") is not None:
        job_resp["experience_required"] = str(job_resp["experience_required"])
        
    return job_resp


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
