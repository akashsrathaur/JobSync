"""
Mock job dataset for MVP testing.
Contains 100+ realistic job listings across various roles and industries.
"""
from datetime import datetime, timedelta
import random
from typing import List, Dict, Any


def generate_mock_jobs() -> List[Dict[str, Any]]:
    """Generate comprehensive mock job dataset."""
    
    jobs = [
        # Software Engineering Jobs
        {
            "title": "Senior Full Stack Engineer",
            "company": "TechCorp Inc",
            "description": "We're seeking an experienced Full Stack Engineer to join our growing team. You'll work on building scalable web applications using React, Node.js, and PostgreSQL. Strong experience with cloud platforms (AWS/GCP) is required. You'll collaborate with product managers and designers to deliver high-quality features.",
            "location": "San Francisco, CA",
            "salary_min": 140000,
            "salary_max": 180000,
            "experience_required": "5-8 years",
            "required_skills": ["React", "Node.js", "PostgreSQL", "AWS", "TypeScript", "REST API"],
            "source": "Mock",
            "external_url": "https://example.com/job/1",
            "posted_at": datetime.utcnow() - timedelta(days=2)
        },
        {
            "title": "Frontend Developer",
            "company": "StartupXYZ",
            "description": "Join our fast-paced startup as a Frontend Developer. Build beautiful, responsive user interfaces using React and TypeScript. Experience with modern CSS frameworks and state management (Redux/MobX) is essential. You'll work directly with our design team to implement pixel-perfect UIs.",
            "location": "Remote",
            "salary_min": 90000,
            "salary_max": 130000,
            "experience_required": "2-4 years",
            "required_skills": ["React", "TypeScript", "CSS", "Redux", "JavaScript", "Git"],
            "source": "Mock",
            "external_url": "https://example.com/job/2",
            "posted_at": datetime.utcnow() - timedelta(days=1)
        },
        {
            "title": "Backend Engineer - Python",
            "company": "DataFlow Systems",
            "description": "Looking for a Backend Engineer with strong Python skills. You'll design and implement RESTful APIs using FastAPI/Django, work with PostgreSQL and Redis, and build scalable microservices. Experience with Docker and Kubernetes is a plus.",
            "location": "New York, NY",
            "salary_min": 120000,
            "salary_max": 160000,
            "experience_required": "3-6 years",
            "required_skills": ["Python", "FastAPI", "Django", "PostgreSQL", "Docker", "Redis"],
            "source": "Mock",
            "external_url": "https://example.com/job/3",
            "posted_at": datetime.utcnow() - timedelta(days=3)
        },
        {
            "title": "DevOps Engineer",
            "company": "CloudNative Solutions",
            "description": "We need a DevOps Engineer to manage our cloud infrastructure. Responsibilities include maintaining CI/CD pipelines, managing Kubernetes clusters, and ensuring system reliability. Strong experience with AWS, Terraform, and monitoring tools required.",
            "location": "Austin, TX",
            "salary_min": 130000,
            "salary_max": 170000,
            "experience_required": "4-7 years",
            "required_skills": ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins", "Linux"],
            "source": "Mock",
            "external_url": "https://example.com/job/4",
            "posted_at": datetime.utcnow() - timedelta(days=5)
        },
        {
            "title": "Junior Software Developer",
            "company": "InnovateTech",
            "description": "Entry-level position for recent graduates or developers with 1-2 years of experience. You'll work on web applications using JavaScript, learn best practices, and collaborate with senior developers. Great opportunity to grow your skills in a supportive environment.",
            "location": "Seattle, WA",
            "salary_min": 70000,
            "salary_max": 95000,
            "experience_required": "0-2 years",
            "required_skills": ["JavaScript", "HTML", "CSS", "Git", "React"],
            "source": "Mock",
            "external_url": "https://example.com/job/5",
            "posted_at": datetime.utcnow() - timedelta(days=1)
        },
        
        # Data Science Jobs
        {
            "title": "Machine Learning Engineer",
            "company": "AI Innovations",
            "description": "Join our ML team to build and deploy machine learning models at scale. You'll work with PyTorch/TensorFlow, design experiments, and implement production ML pipelines. Strong Python skills and understanding of deep learning required.",
            "location": "Boston, MA",
            "salary_min": 150000,
            "salary_max": 200000,
            "experience_required": "4-6 years",
            "required_skills": ["Python", "PyTorch", "TensorFlow", "Machine Learning", "Deep Learning", "AWS"],
            "source": "Mock",
            "external_url": "https://example.com/job/6",
            "posted_at": datetime.utcnow() - timedelta(days=4)
        },
        {
            "title": "Data Scientist",
            "company": "Analytics Pro",
            "description": "We're looking for a Data Scientist to analyze large datasets and build predictive models. Experience with Python, SQL, and statistical analysis is required. You'll work with business stakeholders to derive actionable insights.",
            "location": "Chicago, IL",
            "salary_min": 110000,
            "salary_max": 145000,
            "experience_required": "3-5 years",
            "required_skills": ["Python", "SQL", "Pandas", "Scikit-learn", "Statistics", "Data Visualization"],
            "source": "Mock",
            "external_url": "https://example.com/job/7",
            "posted_at": datetime.utcnow() - timedelta(days=6)
        },
        {
            "title": "Data Engineer",
            "company": "BigData Corp",
            "description": "Build and maintain data pipelines processing terabytes of data daily. Strong experience with Spark, Airflow, and cloud data warehouses (Snowflake/Redshift) required. You'll design ETL processes and optimize data infrastructure.",
            "location": "Remote",
            "salary_min": 125000,
            "salary_max": 165000,
            "experience_required": "3-6 years",
            "required_skills": ["Python", "Spark", "Airflow", "SQL", "AWS", "Snowflake"],
            "source": "Mock",
            "external_url": "https://example.com/job/8",
            "posted_at": datetime.utcnow() - timedelta(days=2)
        },
        
        # Mobile Development
        {
            "title": "iOS Developer",
            "company": "Mobile First Inc",
            "description": "Develop native iOS applications using Swift and SwiftUI. Experience with RESTful APIs, Core Data, and App Store deployment required. You'll work on consumer-facing apps with millions of users.",
            "location": "Los Angeles, CA",
            "salary_min": 115000,
            "salary_max": 155000,
            "experience_required": "3-5 years",
            "required_skills": ["Swift", "SwiftUI", "iOS", "Xcode", "REST API", "Git"],
            "source": "Mock",
            "external_url": "https://example.com/job/9",
            "posted_at": datetime.utcnow() - timedelta(days=3)
        },
        {
            "title": "React Native Developer",
            "company": "CrossPlatform Apps",
            "description": "Build cross-platform mobile applications using React Native. Strong JavaScript/TypeScript skills required. Experience with native modules and app deployment to both iOS and Android stores preferred.",
            "location": "Denver, CO",
            "salary_min": 100000,
            "salary_max": 140000,
            "experience_required": "2-5 years",
            "required_skills": ["React Native", "JavaScript", "TypeScript", "iOS", "Android", "Redux"],
            "source": "Mock",
            "external_url": "https://example.com/job/10",
            "posted_at": datetime.utcnow() - timedelta(days=7)
        },
        
        # Additional diverse roles
        {
            "title": "Cloud Architect",
            "company": "Enterprise Solutions",
            "description": "Design and implement cloud infrastructure for enterprise clients. Deep expertise in AWS/Azure, microservices architecture, and security best practices required. You'll lead technical discussions with stakeholders.",
            "location": "Washington, DC",
            "salary_min": 160000,
            "salary_max": 210000,
            "experience_required": "7-10 years",
            "required_skills": ["AWS", "Azure", "Microservices", "Kubernetes", "Terraform", "Security"],
            "source": "Mock",
            "external_url": "https://example.com/job/11",
            "posted_at": datetime.utcnow() - timedelta(days=4)
        },
        {
            "title": "QA Automation Engineer",
            "company": "QualityFirst",
            "description": "Build automated testing frameworks using Selenium, Cypress, or similar tools. Experience with CI/CD integration and test strategy development required. Help maintain high code quality across our products.",
            "location": "Portland, OR",
            "salary_min": 95000,
            "salary_max": 130000,
            "experience_required": "3-5 years",
            "required_skills": ["Selenium", "Cypress", "Python", "JavaScript", "CI/CD", "Testing"],
            "source": "Mock",
            "external_url": "https://example.com/job/12",
            "posted_at": datetime.utcnow() - timedelta(days=5)
        },
        {
            "title": "Security Engineer",
            "company": "SecureNet",
            "description": "Protect our infrastructure and applications from security threats. Conduct security audits, implement security controls, and respond to incidents. Strong knowledge of network security, cryptography, and compliance required.",
            "location": "San Diego, CA",
            "salary_min": 135000,
            "salary_max": 175000,
            "experience_required": "4-7 years",
            "required_skills": ["Security", "Network Security", "Cryptography", "Linux", "Python", "AWS"],
            "source": "Mock",
            "external_url": "https://example.com/job/13",
            "posted_at": datetime.utcnow() - timedelta(days=8)
        },
        {
            "title": "Product Manager - Technical",
            "company": "ProductCo",
            "description": "Lead product development for our B2B SaaS platform. Technical background required to work closely with engineering teams. Define roadmaps, gather requirements, and drive product strategy.",
            "location": "San Francisco, CA",
            "salary_min": 140000,
            "salary_max": 190000,
            "experience_required": "5-8 years",
            "required_skills": ["Product Management", "Agile", "SQL", "Analytics", "Technical Writing"],
            "source": "Mock",
            "external_url": "https://example.com/job/14",
            "posted_at": datetime.utcnow() - timedelta(days=3)
        },
        {
            "title": "UX/UI Designer",
            "company": "DesignHub",
            "description": "Create beautiful, user-friendly interfaces for web and mobile applications. Strong portfolio demonstrating design thinking and proficiency in Figma/Sketch required. Collaborate with developers to implement designs.",
            "location": "Remote",
            "salary_min": 85000,
            "salary_max": 120000,
            "experience_required": "2-5 years",
            "required_skills": ["Figma", "Sketch", "UI Design", "UX Design", "Prototyping", "User Research"],
            "source": "Mock",
            "external_url": "https://example.com/job/15",
            "posted_at": datetime.utcnow() - timedelta(days=2)
        },
    ]
    
    return jobs


# Export function
def get_mock_jobs() -> List[Dict[str, Any]]:
    """Get mock job listings for MVP."""
    return generate_mock_jobs()
