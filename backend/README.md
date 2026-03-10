# JobSync API

The backend service for the JobSync platform. It powers resume parsing, job recommendation scoring, and data management.

## Technology Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL 14+
- **ORM**: SQLAlchemy 2.0
- **NLP & ML**: spaCy, Sentence-Transformers, scikit-learn
- **Document Processing**: PyPDF2, pdfplumber

## Development Setup

1. **Environment Setup**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Dependencies**
   ```bash
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```

3. **Configuration**
   Copy `.env.example` to `.env` and assign your PostgreSQL connection string and a newly generated `SECRET_KEY`.

4. **Running the Local Server**
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will start on port 8000. Interactive documentation is available at `/docs`.

## Directory Overview

- `app/core/`: Application settings and middleware configurations.
- `app/db/`: Database session management and engine initialization.
- `app/models/`: SQLAlchemy data models.
- `app/routes/`: FastAPI router definitions.
- `app/services/`: Core logic, including NLP and matching algorithms.
- `app/schemas.py`: Pydantic models for request validation.

## Deployment

A `Dockerfile` is included for containerized deployment.
```bash
docker build -t jobsync-backend .
docker run -p 8000:8000 --env-file .env jobsync-backend
```
