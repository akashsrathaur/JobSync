"""
Resume parser service using spaCy and transformers.
Extracts skills, experience, education, and other relevant information from resumes.
"""
import re
import spacy
from typing import Dict, List, Any, Optional
from datetime import datetime
import PyPDF2
import pdfplumber
from io import BytesIO

from app.core.config import settings


class ResumeParser:
    """Parser for extracting structured data from resumes."""
    
    def __init__(self):
        """Initialize the resume parser with spaCy model."""
        try:
            self.nlp = spacy.load(settings.SPACY_MODEL)
        except OSError:
            # Model not found, download it
            import subprocess
            subprocess.run(["python", "-m", "spacy", "download", settings.SPACY_MODEL])
            self.nlp = spacy.load(settings.SPACY_MODEL)
        
        # Comprehensive skill database (expandable)
        self.skill_database = self._load_skill_database()
    
    def _load_skill_database(self) -> Dict[str, List[str]]:
        """Load comprehensive skill taxonomy."""
        return {
            "Programming Languages": [
                "python", "java", "javascript", "typescript", "c++", "c#", "ruby", "go", 
                "rust", "php", "swift", "kotlin", "scala", "r", "matlab", "perl"
            ],
            "Web Frameworks": [
                "react", "angular", "vue", "django", "flask", "fastapi", "express", 
                "spring", "laravel", "rails", "nextjs", "nuxt", "svelte"
            ],
            "Databases": [
                "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "cassandra",
                "dynamodb", "oracle", "sql server", "sqlite", "neo4j"
            ],
            "Cloud Platforms": [
                "aws", "azure", "gcp", "google cloud", "heroku", "digitalocean", 
                "vercel", "netlify", "cloudflare"
            ],
            "DevOps Tools": [
                "docker", "kubernetes", "jenkins", "gitlab ci", "github actions", 
                "terraform", "ansible", "circleci", "travis ci"
            ],
            "Data Science": [
                "machine learning", "deep learning", "nlp", "computer vision", 
                "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy", "keras"
            ],
            "Other Tools": [
                "git", "linux", "bash", "rest api", "graphql", "microservices",
                "agile", "scrum", "jira", "confluence"
            ]
        }
    
    def extract_text_from_pdf(self, file_content: bytes) -> str:
        """
        Extract text from PDF file.
        
        Args:
            file_content: PDF file content as bytes
            
        Returns:
            Extracted text string
        """
        text = ""
        
        try:
            # Try pdfplumber first (better for complex layouts)
            with pdfplumber.open(BytesIO(file_content)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception:
            # Fallback to PyPDF2
            try:
                pdf_reader = PyPDF2.PdfReader(BytesIO(file_content))
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
            except Exception as e:
                raise ValueError(f"Failed to extract text from PDF: {str(e)}")
        
        return text.strip()
    
    def extract_skills(self, text: str) -> List[Dict[str, str]]:
        """
        Extract skills from text using skill database.
        
        Args:
            text: Resume text
            
        Returns:
            List of skills with categories
        """
        text_lower = text.lower()
        found_skills = []
        
        for category, skills in self.skill_database.items():
            for skill in skills:
                # Use word boundaries to avoid partial matches
                pattern = r'\b' + re.escape(skill) + r'\b'
                if re.search(pattern, text_lower):
                    found_skills.append({
                        "skill_name": skill.title(),
                        "skill_category": category
                    })
        
        # Remove duplicates
        unique_skills = []
        seen = set()
        for skill in found_skills:
            key = skill["skill_name"].lower()
            if key not in seen:
                seen.add(key)
                unique_skills.append(skill)
        
        return unique_skills
    
    def extract_experience(self, text: str, doc: Any) -> List[Dict[str, Any]]:
        """
        Extract work experience from resume.
        
        Args:
            text: Resume text
            doc: spaCy Doc object
            
        Returns:
            List of experience entries
        """
        experiences = []
        
        # Extract organizations using NER
        organizations = [ent.text for ent in doc.ents if ent.label_ == "ORG"]
        
        # Extract date ranges
        date_pattern = r'(\d{4})\s*[-–]\s*(\d{4}|present|current)'
        date_matches = re.finditer(date_pattern, text, re.IGNORECASE)
        
        # Extract job titles (common patterns)
        title_keywords = [
            "engineer", "developer", "analyst", "manager", "designer", "scientist",
            "architect", "consultant", "specialist", "lead", "senior", "junior",
            "intern", "director", "coordinator"
        ]
        
        lines = text.split('\n')
        for i, line in enumerate(lines):
            line_lower = line.lower()
            # Check if line contains job title keywords
            if any(keyword in line_lower for keyword in title_keywords):
                experience = {
                    "title": line.strip(),
                    "company": organizations[len(experiences)] if len(experiences) < len(organizations) else "Unknown",
                    "duration": None
                }
                
                # Try to find date range in nearby lines
                context = ' '.join(lines[max(0, i-1):min(len(lines), i+3)])
                date_match = re.search(date_pattern, context, re.IGNORECASE)
                if date_match:
                    experience["duration"] = f"{date_match.group(1)} - {date_match.group(2)}"
                
                experiences.append(experience)
        
        return experiences[:10]  # Limit to 10 most recent
    
    def extract_education(self, text: str, doc: Any) -> List[Dict[str, Any]]:
        """
        Extract education information from resume.
        
        Args:
            text: Resume text
            doc: spaCy Doc object
            
        Returns:
            List of education entries
        """
        education = []
        
        # Degree keywords
        degree_patterns = [
            r'\b(bachelor|b\.s\.|b\.a\.|bs|ba)\b',
            r'\b(master|m\.s\.|m\.a\.|ms|ma|mba)\b',
            r'\b(phd|ph\.d\.|doctorate)\b',
            r'\b(associate|a\.s\.|a\.a\.)\b'
        ]
        
        # Field of study keywords
        field_keywords = [
            "computer science", "engineering", "mathematics", "physics", "chemistry",
            "business", "economics", "finance", "marketing", "biology", "psychology"
        ]
        
        lines = text.split('\n')
        for i, line in enumerate(lines):
            line_lower = line.lower()
            
            # Check for degree
            for pattern in degree_patterns:
                if re.search(pattern, line_lower):
                    edu_entry = {
                        "degree": line.strip(),
                        "institution": None,
                        "year": None
                    }
                    
                    # Try to find institution in nearby lines
                    context = ' '.join(lines[max(0, i-1):min(len(lines), i+3)])
                    
                    # Extract year
                    year_match = re.search(r'\b(19|20)\d{2}\b', context)
                    if year_match:
                        edu_entry["year"] = year_match.group(0)
                    
                    # Extract institution (look for ORG entities)
                    context_doc = self.nlp(context)
                    orgs = [ent.text for ent in context_doc.ents if ent.label_ == "ORG"]
                    if orgs:
                        edu_entry["institution"] = orgs[0]
                    
                    education.append(edu_entry)
                    break
        
        return education
    
    def extract_contact_info(self, text: str, doc: Any) -> Dict[str, Optional[str]]:
        """
        Extract contact information from resume.
        
        Args:
            text: Resume text
            doc: spaCy Doc object
            
        Returns:
            Dictionary with contact information
        """
        contact = {
            "email": None,
            "phone": None,
            "location": None
        }
        
        # Extract email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_match = re.search(email_pattern, text)
        if email_match:
            contact["email"] = email_match.group(0)
        
        # Extract phone
        phone_pattern = r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'
        phone_match = re.search(phone_pattern, text)
        if phone_match:
            contact["phone"] = phone_match.group(0)
        
        # Extract location (GPE entities)
        locations = [ent.text for ent in doc.ents if ent.label_ == "GPE"]
        if locations:
            contact["location"] = locations[0]
        
        return contact
    
    def parse(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        """
        Main parsing function to extract all information from resume.
        
        Args:
            file_content: Resume file content as bytes
            filename: Original filename
            
        Returns:
            Dictionary with parsed resume data
        """
        # Extract text
        if filename.lower().endswith('.pdf'):
            text = self.extract_text_from_pdf(file_content)
        else:
            raise ValueError("Only PDF files are supported currently")
        
        # Process with spaCy
        doc = self.nlp(text)
        
        # Extract all components
        skills = self.extract_skills(text)
        experience = self.extract_experience(text, doc)
        education = self.extract_education(text, doc)
        contact = self.extract_contact_info(text, doc)
        
        # Generate summary (first few sentences)
        sentences = [sent.text.strip() for sent in doc.sents]
        summary = ' '.join(sentences[:3]) if len(sentences) >= 3 else text[:500]
        
        return {
            "raw_text": text,
            "skills": skills,
            "experience": experience,
            "education": education,
            "contact": contact,
            "summary": summary,
            "parsed_at": datetime.utcnow().isoformat()
        }


# Global parser instance
resume_parser = ResumeParser()
