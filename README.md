# JobSync - AI Job Matching Platform

A production-ready, full-stack AI-powered job matching platform that helps job seekers find highly relevant opportunities through intelligent resume analysis and semantic matching.

![Tech Stack](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## 🚀 Features

### For Job Seekers
- **AI Resume Parsing**: Automatically extract skills, experience, and education from PDF resumes using spaCy NLP
- **Smart Job Matching**: 3-layer matching algorithm combining TF-IDF, Sentence-BERT, and preference matching
- **Match Scores**: See detailed compatibility scores (0-100) for each job with breakdown by skill, experience, location, and salary
- **Personalized Recommendations**: Set preferences for role, location, salary, and experience level
- **Application Tracking**: Save jobs and track application status

### Technical Highlights
- **Backend**: FastAPI with 20+ RESTful endpoints
- **AI/ML**: spaCy NER, Sentence-Transformers (all-MiniLM-L6-v2), TF-IDF, cosine similarity
- **Database**: PostgreSQL with SQLAlchemy ORM, 9 tables with relationships
- **Authentication**: JWT with auto-refresh tokens
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Deployment Ready**: Docker support, Vercel-ready frontend

## 📋 Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Cost Estimation](#cost-estimation)

## 🏗️ Architecture

```
┌─────────────────┐
│   Next.js UI    │  ← User Interface (Vercel)
└────────┬────────┘
         │ HTTPS/REST
┌────────▼────────┐
│  FastAPI Backend│  ← API Server (Render/Railway)
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼────┐
│ AI   │  │ Postgre│
│Engine│  │  SQL   │
└──────┘  └────────┘
```

### AI Matching Algorithm

**3-Layer Approach**:
1. **TF-IDF Keyword Matching (50%)**: Exact skill matches
2. **Semantic Similarity (20%)**: Contextual understanding via Sentence-BERT
3. **Preference Matching (30%)**: Location, experience, salary compatibility

**Formula**:
```
FinalScore = (SkillMatch × 0.5) + (SemanticSimilarity × 0.2) + 
             (ExperienceMatch × 0.1) + (LocationMatch × 0.1) + 
             (SalaryMatch × 0.1) × 100
```

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI 0.109
- **Database**: PostgreSQL 14+ with SQLAlchemy 2.0
- **AI/ML**: 
  - spaCy 3.7 (NER)
  - Sentence-Transformers 2.3 (embeddings)
  - scikit-learn 1.4 (TF-IDF, cosine similarity)
- **Auth**: JWT (python-jose)
- **PDF Processing**: PyPDF2, pdfplumber

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **HTTP Client**: Axios
- **Deployment**: Vercel

### Database Schema
- **9 Tables**: Users, Resumes, Resume_Skills, Preferences, Jobs, Job_Skills, Matches, Saved_Jobs, Applications
- **Relationships**: Fully normalized with foreign keys
- **Indexes**: Optimized for performance (email, user_id, match_score, etc.)

## ⚡ Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- npm/yarn

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd JobSync
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL and SECRET_KEY

# Run server
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run development server
npm run dev
```

Frontend runs at `http://localhost:3000`

### 4. Database Setup

**Option A: Local PostgreSQL**
```bash
# Create database
createdb jobsync

# Update .env
DATABASE_URL=postgresql://user:password@localhost:5432/jobsync
```

**Option B: Supabase (Free)**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string to `.env`

## 🚀 Deployment

### Backend Deployment (Render)

1. **Create account** at [render.com](https://render.com)

2. **Create Web Service**:
   - Connect GitHub repository
   - Root directory: `backend`
   - Build command: `pip install -r requirements.txt && python -m spacy download en_core_web_sm`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Add environment variables**:
   ```
   DATABASE_URL=<your-postgres-url>
   SECRET_KEY=<generate-with-openssl-rand-hex-32>
   FRONTEND_URL=https://your-app.vercel.app
   ```

4. **Create PostgreSQL database** in Render (or use Supabase)

### Frontend Deployment (Vercel)

1. **Push to GitHub**

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import repository
   - Root directory: `frontend`
   - Framework: Next.js

3. **Add environment variable**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   ```

4. **Deploy!**

### Docker Deployment

```bash
# Backend
cd backend
docker build -t jobsync-backend .
docker run -p 8000:8000 --env-file .env jobsync-backend

# Frontend
cd frontend
docker build -t jobsync-frontend .
docker run -p 3000:3000 jobsync-frontend
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get user profile

### Resumes
- `POST /api/resumes/upload` - Upload & parse resume
- `GET /api/resumes` - List resumes
- `DELETE /api/resumes/{id}` - Delete resume

### Jobs
- `GET /api/jobs` - All jobs (paginated)
- `GET /api/jobs/matched` - Matched jobs with scores
- `POST /api/jobs/{id}/save` - Save job
- `GET /api/jobs/saved/list` - Saved jobs

### Applications
- `POST /api/applications` - Submit application
- `GET /api/applications` - List applications
- `PATCH /api/applications/{id}` - Update status

Full API docs: `http://localhost:8000/docs`

## 📁 Project Structure

```
JobSync/
├── backend/
│   ├── app/
│   │   ├── core/          # Config, security
│   │   ├── db/            # Database setup
│   │   ├── models/        # SQLAlchemy models
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # AI engine, parsers
│   │   ├── schemas.py     # Pydantic schemas
│   │   └── main.py        # FastAPI app
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/
│   │   ├── auth/          # Login/signup
│   │   ├── dashboard/     # Main app
│   │   ├── page.tsx       # Landing page
│   │   └── globals.css    # Styles
│   ├── lib/
│   │   ├── api-client.ts  # Axios client
│   │   └── config.ts      # API config
│   └── package.json
└── README.md
```

## 💻 Development

### Backend Testing
```bash
cd backend
pytest
```

### Frontend Testing
```bash
cd frontend
npm run lint
npm run build
```

### Code Formatting
```bash
# Backend
black app/

# Frontend
npm run lint
```

## 💰 Cost Estimation

### MVP (Free Tier)
| Service | Cost | Notes |
|---------|------|-------|
| Vercel | $0 | Frontend hosting |
| Render | $0 | Backend (limited resources) |
| Supabase | $0 | 500MB database |
| **Total** | **$0/month** | Perfect for MVP |

### Production (Paid Tier)
| Service | Cost | Notes |
|---------|------|-------|
| Vercel Pro | $20/month | Better performance |
| Render Standard | $25/month | 2GB RAM, always-on |
| Supabase Pro | $25/month | 8GB database |
| AWS S3 | $5/month | Resume storage |
| **Total** | **$75/month** | Supports 1K+ users |

### Scale (High Traffic)
| Service | Cost | Notes |
|---------|------|-------|
| AWS Infrastructure | $160/month | 10K+ users |
| Redis Cache | $10/month | Performance |
| Pinecone Vector DB | $70/month | Advanced matching |
| **Total** | **$240/month** | Enterprise-ready |

## 🎯 Roadmap

### Phase 2 Features
- [ ] Employer dashboard
- [ ] Real-time job alerts
- [ ] Resume optimization suggestions
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Vector database integration (Pinecone)
- [ ] Redis caching
- [ ] Celery background tasks

## 📝 License

MIT License - feel free to use for your projects!

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📧 Support

For questions or issues, please open a GitHub issue.

---

**Built with ❤️ using FastAPI, Next.js, and AI**
