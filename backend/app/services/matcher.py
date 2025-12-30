"""
Job matching service using TF-IDF and Sentence Transformers.
Implements 3-layer matching algorithm for calculating job-resume compatibility.
"""
import numpy as np
from typing import Dict, List, Any, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

from app.core.config import settings


class JobMatcher:
    """AI-powered job matching engine."""
    
    def __init__(self):
        """Initialize the matcher with ML models."""
        # Load Sentence-BERT model for semantic similarity
        self.sentence_model = SentenceTransformer(settings.SENTENCE_TRANSFORMER_MODEL)
        
        # TF-IDF vectorizer for keyword matching
        self.tfidf_vectorizer = TfidfVectorizer(
            max_features=500,
            stop_words='english',
            ngram_range=(1, 2)
        )
    
    def calculate_skill_match(
        self, 
        resume_skills: List[str], 
        job_skills: List[str]
    ) -> float:
        """
        Calculate skill match score using TF-IDF and cosine similarity.
        
        Args:
            resume_skills: List of skills from resume
            job_skills: List of required skills for job
            
        Returns:
            Skill match score (0-1)
        """
        if not resume_skills or not job_skills:
            return 0.0
        
        # Convert to lowercase for comparison
        resume_skills_lower = [skill.lower() for skill in resume_skills]
        job_skills_lower = [skill.lower() for skill in job_skills]
        
        # Exact match count
        exact_matches = len(set(resume_skills_lower) & set(job_skills_lower))
        
        # Calculate as percentage of required skills
        exact_match_score = exact_matches / len(job_skills_lower) if job_skills_lower else 0
        
        # TF-IDF similarity
        try:
            resume_text = ' '.join(resume_skills_lower)
            job_text = ' '.join(job_skills_lower)
            
            tfidf_matrix = self.tfidf_vectorizer.fit_transform([resume_text, job_text])
            tfidf_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        except Exception:
            tfidf_score = exact_match_score
        
        # Weighted combination (favor exact matches)
        final_score = (exact_match_score * 0.7) + (tfidf_score * 0.3)
        
        return min(final_score, 1.0)
    
    def calculate_semantic_similarity(
        self, 
        resume_summary: str, 
        job_description: str
    ) -> float:
        """
        Calculate semantic similarity using Sentence-BERT embeddings.
        
        Args:
            resume_summary: Resume summary text
            job_description: Job description text
            
        Returns:
            Semantic similarity score (0-1)
        """
        if not resume_summary or not job_description:
            return 0.0
        
        try:
            # Generate embeddings
            resume_embedding = self.sentence_model.encode([resume_summary])
            job_embedding = self.sentence_model.encode([job_description])
            
            # Calculate cosine similarity
            similarity = cosine_similarity(resume_embedding, job_embedding)[0][0]
            
            # Normalize to 0-1 range (cosine similarity is already -1 to 1, but typically 0-1)
            return max(0.0, min(similarity, 1.0))
        except Exception as e:
            print(f"Error calculating semantic similarity: {e}")
            return 0.0
    
    def calculate_experience_match(
        self, 
        resume_experience: List[Dict[str, Any]], 
        required_experience: str
    ) -> float:
        """
        Calculate experience level compatibility.
        
        Args:
            resume_experience: List of experience entries from resume
            required_experience: Required experience string (e.g., "2-5 years")
            
        Returns:
            Experience match score (0-1)
        """
        if not resume_experience:
            return 0.0
        
        # Estimate years of experience from resume
        resume_years = len(resume_experience)  # Simplified: count positions
        
        if not required_experience:
            return 1.0  # No requirement specified
        
        # Parse required experience
        import re
        match = re.search(r'(\d+)[-–](\d+)', required_experience)
        if match:
            min_years = int(match.group(1))
            max_years = int(match.group(2))
            
            if min_years <= resume_years <= max_years:
                return 1.0
            elif resume_years < min_years:
                # Penalize less experience
                return max(0.0, resume_years / min_years)
            else:
                # Slight penalty for overqualification
                return 0.9
        
        # Check for keywords
        if "entry" in required_experience.lower() or "junior" in required_experience.lower():
            return 1.0 if resume_years <= 2 else 0.7
        elif "senior" in required_experience.lower():
            return 1.0 if resume_years >= 5 else 0.5
        elif "mid" in required_experience.lower():
            return 1.0 if 2 <= resume_years <= 5 else 0.6
        
        return 0.5  # Default moderate match
    
    def calculate_location_match(
        self, 
        user_location: Optional[str], 
        job_location: Optional[str]
    ) -> float:
        """
        Calculate location compatibility.
        
        Args:
            user_location: User's preferred location
            job_location: Job location
            
        Returns:
            Location match score (0-1)
        """
        if not user_location or not job_location:
            return 0.5  # Neutral if no location specified
        
        user_loc_lower = user_location.lower()
        job_loc_lower = job_location.lower()
        
        # Remote work
        if "remote" in job_loc_lower:
            return 1.0
        
        # Exact match
        if user_loc_lower == job_loc_lower:
            return 1.0
        
        # Partial match (e.g., same city or state)
        if user_loc_lower in job_loc_lower or job_loc_lower in user_loc_lower:
            return 0.8
        
        return 0.0
    
    def calculate_salary_match(
        self,
        user_min_salary: Optional[int],
        user_max_salary: Optional[int],
        job_min_salary: Optional[int],
        job_max_salary: Optional[int]
    ) -> float:
        """
        Calculate salary range compatibility.
        
        Args:
            user_min_salary: User's minimum salary expectation
            user_max_salary: User's maximum salary expectation
            job_min_salary: Job's minimum salary
            job_max_salary: Job's maximum salary
            
        Returns:
            Salary match score (0-1)
        """
        if not user_min_salary or not job_max_salary:
            return 0.5  # Neutral if no salary specified
        
        # Check if ranges overlap
        if user_min_salary <= job_max_salary and (not user_max_salary or user_max_salary >= job_min_salary):
            # Calculate overlap percentage
            overlap_start = max(user_min_salary, job_min_salary or 0)
            overlap_end = min(user_max_salary or float('inf'), job_max_salary)
            
            if overlap_end >= overlap_start:
                return 1.0
        
        # User expectations too high
        if user_min_salary > job_max_salary:
            gap = user_min_salary - job_max_salary
            penalty = min(gap / user_min_salary, 0.5)
            return max(0.0, 0.5 - penalty)
        
        return 0.3
    
    def calculate_match_score(
        self,
        resume_data: Dict[str, Any],
        job_data: Dict[str, Any],
        preferences: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Calculate comprehensive match score using 3-layer algorithm.
        
        Formula:
        FinalScore = (SkillMatch * 0.5) +
                     (SemanticSimilarity * 0.2) +
                     (ExperienceMatch * 0.1) +
                     (LocationMatch * 0.1) +
                     (SalaryMatch * 0.1)
        
        Args:
            resume_data: Parsed resume data
            job_data: Job listing data
            preferences: User preferences (optional)
            
        Returns:
            Dictionary with match score and breakdown
        """
        # Extract resume skills
        resume_skills = [skill['skill_name'] for skill in resume_data.get('skills', [])]
        resume_summary = resume_data.get('summary', '')
        resume_experience = resume_data.get('experience', [])
        
        # Extract job requirements
        job_skills = job_data.get('required_skills', [])
        job_description = job_data.get('description', '')
        required_experience = job_data.get('experience_required', '')
        job_location = job_data.get('location')
        job_min_salary = job_data.get('salary_min')
        job_max_salary = job_data.get('salary_max')
        
        # Extract preferences
        user_location = preferences.get('location') if preferences else None
        user_min_salary = preferences.get('min_salary') if preferences else None
        user_max_salary = preferences.get('max_salary') if preferences else None
        
        # Calculate individual scores
        skill_score = self.calculate_skill_match(resume_skills, job_skills)
        semantic_score = self.calculate_semantic_similarity(resume_summary, job_description)
        experience_score = self.calculate_experience_match(resume_experience, required_experience)
        location_score = self.calculate_location_match(user_location, job_location)
        salary_score = self.calculate_salary_match(
            user_min_salary, user_max_salary, 
            job_min_salary, job_max_salary
        )
        
        # Weighted final score
        final_score = (
            skill_score * 0.5 +
            semantic_score * 0.2 +
            experience_score * 0.1 +
            location_score * 0.1 +
            salary_score * 0.1
        ) * 100  # Convert to 0-100 scale
        
        return {
            "match_score": round(final_score, 2),
            "score_breakdown": {
                "skill_match": round(skill_score * 100, 2),
                "semantic_similarity": round(semantic_score * 100, 2),
                "experience_match": round(experience_score * 100, 2),
                "location_match": round(location_score * 100, 2),
                "salary_match": round(salary_score * 100, 2)
            }
        }


# Global matcher instance
job_matcher = JobMatcher()
