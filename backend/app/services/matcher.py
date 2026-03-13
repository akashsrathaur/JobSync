"""
Job matching service using Gemini AI.
"""
import json
from typing import Dict, List, Any, Optional
import google.generativeai as genai

from app.core.config import settings

class JobMatcher:
    """AI-powered job matching engine using Gemini."""
    
    def __init__(self):
        """Initialize the matcher with Gemini AI."""
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    def calculate_skill_match(self, resume_skills: List[str], job_skills: List[str]) -> float:
        """Calculate skill match score (purely logic based)."""
        if not resume_skills or not job_skills:
            return 0.0
            
        resume_skills_lower = set(skill.lower() for skill in resume_skills)
        job_skills_lower = set(skill.lower() for skill in job_skills)
        
        exact_matches = len(resume_skills_lower & job_skills_lower)
        return min((exact_matches / len(job_skills_lower)) * 1.2, 1.0) if job_skills_lower else 0.0
        
    def calculate_experience_match(self, resume_experience: List[Dict[str, Any]], required_experience: str) -> float:
        """Calculate experience level compatibility."""
        if not resume_experience: return 0.0
        resume_years = len(resume_experience) 
        if not required_experience: return 1.0
        
        req_lower = required_experience.lower()
        if "entry" in req_lower or "junior" in req_lower:
            return 1.0 if resume_years <= 2 else 0.7
        elif "senior" in req_lower:
            return 1.0 if resume_years >= 5 else 0.5
        elif "mid" in req_lower:
            return 1.0 if 2 <= resume_years <= 5 else 0.6
        return 0.5
        
    def calculate_location_match(self, user_location: Optional[str], job_location: Optional[str]) -> float:
        """Calculate location compatibility."""
        if not user_location or not job_location: return 0.5
        u_loc, j_loc = user_location.lower(), job_location.lower()
        if "remote" in j_loc: return 1.0
        if u_loc == j_loc: return 1.0
        if u_loc in j_loc or j_loc in u_loc: return 0.8
        return 0.0
        
    def calculate_salary_match(self, user_min: Optional[int], user_max: Optional[int], job_min: Optional[int], job_max: Optional[int]) -> float:
        """Calculate salary range compatibility."""
        if not user_min or not job_max: return 0.5
        if user_min <= job_max and (not user_max or user_max >= (job_min or 0)): return 1.0
        if user_min > job_max:
            penalty = min((user_min - job_max) / user_min, 0.5)
            return max(0.0, 0.5 - penalty)
        return 0.3

    def calculate_match_score(
        self,
        resume_data: Dict[str, Any],
        job_data: Dict[str, Any],
        preferences: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Calculate comprehensive match score combining logic with an LLM semantic check.
        """
        # 1. Extract lists for calculations
        resume_skills = [skill.get('skill_name', '') for skill in resume_data.get('skills', []) if isinstance(skill, dict)]
        if not resume_skills and resume_data.get('skills') and isinstance(resume_data['skills'][0], str):
            resume_skills = resume_data['skills'] # Handle if prompt returned raw strings
            
        job_skills = job_data.get('required_skills', [])
        
        # 2. Logic-based scoring
        skill_score = self.calculate_skill_match(resume_skills, job_skills)
        exp_score = self.calculate_experience_match(resume_data.get('experience', []), job_data.get('experience_required', ''))
        
        prefs = preferences or {}
        loc_score = self.calculate_location_match(prefs.get('location'), job_data.get('location'))
        sal_score = self.calculate_salary_match(
            prefs.get('min_salary'), prefs.get('max_salary'), 
            job_data.get('salary_min'), job_data.get('salary_max')
        )

        # 3. Use Gemini for Semantic Similarity via a prompt
        resume_summary = resume_data.get('summary', '')
        job_desc = job_data.get('description', '')
        semantic_score = 0.5 # Default middle ground

        if resume_summary and job_desc:
            prompt = f"""
            Analyze how well this candidate's resume summary matches the job description.
            Rate the semantic similarity on a scale of 0.0 to 1.0. 
            Return ONLY a valid JSON object containing the float score like this: {{"score": 0.85}}
            
            Resume Summary: {resume_summary}
            ---
            Job Description: {job_desc}
            """
            try:
                response = self.model.generate_content(prompt)
                text = response.text.strip()
                if text.startswith("```json"): text = text[7:]
                if text.startswith("```"): text = text[3:]
                if text.endswith("```"): text = text[:-3]
                
                result = json.loads(text.strip())
                semantic_score = float(result.get("score", 0.5))
            except Exception as e:
                print(f"Gemini Semantic Error: {e}")
        
        # 4. Final Weighted Score
        final_score = (
            skill_score * 0.45 +
            semantic_score * 0.25 +
            exp_score * 0.10 +
            loc_score * 0.10 +
            sal_score * 0.10
        ) * 100
        
        return {
            "match_score": round(final_score, 2),
            "score_breakdown": {
                "skill_match": round(skill_score * 100, 2),
                "semantic_similarity": round(semantic_score * 100, 2),
                "experience_match": round(exp_score * 100, 2),
                "location_match": round(loc_score * 100, 2),
                "salary_match": round(sal_score * 100, 2)
            }
        }

# Global matcher instance
job_matcher = JobMatcher()

