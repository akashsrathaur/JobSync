# JobSync Backend

AI-powered job matching platform backend built with FastAPI.

## Features

- 🔐 JWT Authentication
- 📄 Resume parsing with spaCy NLP
- 🤖 AI-powered job matching (TF-IDF + Sentence-BERT)
- 💾 PostgreSQL database with SQLAlchemy ORM
- 🚀 RESTful API with automatic documentation
- 🐳 Docker support

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **AI/ML**: spaCy, Sentence-Transformers, scikit-learn
- **Authentication**: JWT (python-jose)
- **PDF Processing**: PyPDF2, pdfplumber

## Setup

### Prerequisites

- Python 3.11+
- PostgreSQL 14+
- pip

### Installation

1. **Clone the repository** (if not already done)

2. **Create virtual environment**:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Download spaCy model**:
```bash
python -m spacy download en_core_web_sm
```

5. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret key (generate with `openssl rand -hex 32`)

6. **Run the application**:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### Resumes
- `POST /api/resumes/upload` - Upload and parse resume
- `GET /api/resumes` - Get user's resumes
- `GET /api/resumes/{id}` - Get specific resume
- `DELETE /api/resumes/{id}` - Delete resume

### Preferences
- `POST /api/preferences` - Set job preferences
- `GET /api/preferences` - Get preferences
- `PUT /api/preferences` - Update preferences

### Jobs
- `GET /api/jobs` - Get all jobs (paginated)
- `GET /api/jobs/matched` - Get matched jobs with scores
- `GET /api/jobs/{id}` - Get job details
- `POST /api/jobs/{id}/save` - Save job
- `DELETE /api/jobs/{id}/save` - Unsave job
- `GET /api/jobs/saved/list` - Get saved jobs

### Applications
- `POST /api/applications` - Submit application
- `GET /api/applications` - Get user's applications
- `PATCH /api/applications/{id}` - Update application status

## Docker Deployment

```bash
# Build image
docker build -t jobsync-backend .

# Run container
docker run -p 8000:8000 --env-file .env jobsync-backend
```

## Project Structure

```
backend/
├── app/
│   ├── core/           # Configuration and security
│   ├── db/             # Database setup
│   ├── models/         # SQLAlchemy models
│   ├── routes/         # API endpoints
│   ├── services/       # Business logic (AI, parsing)
│   ├── schemas.py      # Pydantic schemas
│   └── main.py         # FastAPI app
├── requirements.txt
├── Dockerfile
└── .env.example
```

## Development

### Running Tests
```bash
pytest
```

### Code Formatting
```bash
black app/
```

## License

MIT
