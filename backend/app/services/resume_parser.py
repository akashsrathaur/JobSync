# ==========================================
# Project: JobSync
# Author: Akash S Rathaur
# Description: Core module for system operations.
# ==========================================

"""
Resume parser service using Gemini API.
Extracts structured information from resumes.
"""
import json
from typing import Dict, Any
from datetime import datetime
import PyPDF2
import pdfplumber
from io import BytesIO
import google.generativeai as genai

from app.core.config import settings

class ResumeParser:
    """Parser for extracting structured data from resumes using Gemini."""
    
    def __init__(self):
        """Initialize the resume parser with Gemini API."""
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    def extract_text_from_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF file."""
        text = ""
        try:
            # Try pdfplumber first
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
    
    def parse(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        """Main parsing function using Gemini API."""
        if not filename.lower().endswith('.pdf'):
            raise ValueError("Only PDF files are supported currently")
            
        text = self.extract_text_from_pdf(file_content)
        
        prompt = f"""
        Extract the following information from the resume text provided below. 
        Format the output strictly as a JSON object with the following keys:
        - "skills": List of objects with "skill_name" and "skill_category" (e.g. Programming Languages, Frameworks, Cloud, etc.)
        - "experience": List of up to 5 recent jobs. Objects with "title", "company", "duration" (e.g. "2020 - Present")
        - "education": List of objects with "degree", "institution", "year"
        - "contact": Object with "email", "phone", "location"
        - "summary": A 2-3 sentence summary of the candidate's profile.
        
        Resume Text:
        ---
        {text[:10000]} # Limit text to avoid token limits if extremely long
        ---
        
        Return ONLY valid JSON. Do not use markdown code blocks like ```json.
        """
        
        try:
            response = self.model.generate_content(prompt)
            result_text = response.text.strip()
            
            # Clean up potential markdown formatting if Gemini includes it despite instructions
            if result_text.startswith("```json"):
                result_text = result_text[7:]
            if result_text.startswith("```"):
                result_text = result_text[3:]
            if result_text.endswith("```"):
                result_text = result_text[:-3]
                
            parsed_data = json.loads(result_text.strip())
            
            return {
                "raw_text": text,
                "skills": parsed_data.get("skills", []),
                "experience": parsed_data.get("experience", []),
                "education": parsed_data.get("education", []),
                "contact": parsed_data.get("contact", {}),
                "summary": parsed_data.get("summary", "Summary could not be generated."),
                "parsed_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            print(f"Gemini Parsing Error: {e}")
            # Fallback empty structure if API fails
            return {
                "raw_text": text,
                "skills": [],
                "experience": [],
                "education": [],
                "contact": {"email": None, "phone": None, "location": None},
                "summary": "Error parsing resume with AI.",
                "parsed_at": datetime.utcnow().isoformat()
            }

# Global parser instance
resume_parser = ResumeParser()
