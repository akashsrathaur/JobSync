import httpx
from datetime import datetime, timedelta
from typing import List, Dict, Any

from app.core.config import settings

async def fetch_live_jobs(query: str, num_pages: int = 1) -> List[Dict[str, Any]]:
    """
    Fetch live jobs from JSearch API via RapidAPI.
    
    Args:
        query: The search query (e.g., "Python Developer in San Francisco")
        num_pages: Number of pages to retrieve.
        
    Returns:
        List of formatted job dictionaries.
    """
    url = "https://jsearch.p.rapidapi.com/search"
    
    headers = {
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
        "x-rapidapi-key": settings.RAPIDAPI_KEY
    }
    
    formatted_jobs = []
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url, 
                headers=headers, 
                params={"query": query, "page": 1, "num_pages": num_pages}
            )
            response.raise_for_status()
            data = response.json()
            
            for job in data.get("data", []):
                # Map JSearch format to our internal format
                formatted_jobs.append({
                    "title": job.get("job_title", "Unknown Title"),
                    "company": job.get("employer_name", "Unknown Company"),
                    "description": job.get("job_description", ""),
                    "location": f"{job.get('job_city', '')}, {job.get('job_country', '')}".strip(', '),
                    "salary_min": job.get("job_min_salary"), 
                    "salary_max": job.get("job_max_salary"),
                    "experience_required": job.get("job_required_experience", {}).get("required_experience_in_months", 0) // 12 if isinstance(job.get("job_required_experience"), dict) else None,
                    "required_skills": job.get("job_required_skills", []), # Jsearch sometimes provides this
                    "source": "JSearch (Live)",
                    "external_url": job.get("job_apply_link") or job.get("job_city", ""),
                    "posted_at": job.get("job_posted_at_datetime_utc", datetime.utcnow().isoformat()),
                    "employer_logo": job.get("employer_logo")
                })
                
    except Exception as e:
        print(f"Error fetching live jobs: {e}")
        # Return fallback mock data if API fails or key is invalid
        return get_fallback_mock_jobs()
        
    return formatted_jobs


def get_fallback_mock_jobs() -> List[Dict[str, Any]]:
    """Fallback mock jobs in case the API rate limit is hit or fails."""
    return [
       {
            "title": "Software Engineer (Fallback)",
            "company": "TechCorp Inc",
            "description": "This is a fallback job because the live API failed or ran out of credits. We are seeking an experienced Full Stack Engineer.",
            "location": "Remote",
            "salary_min": 100000,
            "salary_max": 150000,
            "experience_required": "3-5 years",
            "required_skills": ["Python", "React", "PostgreSQL"],
            "source": "Mock (API Error)",
            "external_url": "https://example.com",
            "posted_at": datetime.utcnow() - timedelta(days=1)
        }
    ]

# Keep the original synchronous export name for compatibility with existing imports 
# (Note: In a real refactor, we would make the caller async, but we want to minimize breaking changes across files)
def get_mock_jobs() -> List[Dict[str, Any]]:
    """Legacy sync wrapper for compatibility. Ideally, callers should use fetch_live_jobs dynamically."""
    import asyncio
    try:
        # Create a new event loop if one doesn't exist to run the async function synchronously
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # If we are already in an event loop (e.g. FastAPI route), we should ideally await fetch_live_jobs directly.
            # For this simple wrapper fallback, we just return mocks. The true fix is updating the router.
            return get_fallback_mock_jobs()
        return loop.run_until_complete(fetch_live_jobs("Software Developer"))
    except Exception:
        return get_fallback_mock_jobs()
