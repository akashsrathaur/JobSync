# JobSync

JobSync is a full-stack platform designed to help candidates find highly relevant job opportunities through resume analysis and semantic matching. By interpreting resume data alongside job descriptions, the system provides compatibility scores and actionable insights.

## Project Architecture

The application is structured into a modern dual-stack architecture:

- **Frontend**: A Next.js 15 application using the App Router, built with TypeScript and styled via Tailwind CSS.
- **Backend**: A RESTful API built with FastAPI, utilizing a PostgreSQL database via SQLAlchemy.
- **Data Processing**: Natural language processing powered by spaCy, supplemented by Sentence-Transformers (all-MiniLM-L6-v2) for accurate semantic vector matching.

## Key Capabilities

- **Resume Parsing**: Extracts structural data (skills, experience, and education) from user-uploaded PDFs.
- **Job Matching Algorithm**: A multi-layered matching system that aggregates exact keyword matches (TF-IDF), semantic similarity (Sentence-BERT), and user preferences.
- **Compatibility Scoring**: Provides granular match scores detailing compatibility across specific variables such as skills, location requirements, and salary expectations.
- **Application Management**: Allows users to save jobs and track the state of their applications within the platform.

## Getting Started

### Requirements
- Node.js 18.x or later
- Python 3.11 or later
- PostgreSQL 14 or later

### Backend Configuration

1. Navigate to the `backend` directory.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```
3. Install dependencies and download the NLP model:
   ```bash
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```
4. Configure your environment variables in `.env` (refer to `.env.example`).
5. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Configuration

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your local environment file (`.env.local`) with the correct API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Reference

When running the backend server locally, comprehensive interactive API documentation is automatically generated and accessible at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

- `/frontend` - Contains all Next.js source code, components, and client-side logic.
- `/backend` - Contains FastAPI routing, database models, ML logic, and migrations.

## Author

**Akash S Rathaur** ([@akashsrathaur](https://github.com/akashsrathaur))

## License

This project is licensed under the MIT License.
