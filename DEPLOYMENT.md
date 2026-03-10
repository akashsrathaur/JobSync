# JobSync Deployment Guide

Good news! This `JobSync` project is ready for deployment.

## 🚦 Pre-Deployment Checklist
* **Frontend (Next.js)**: The code compiles successfully. It communicates with the backend via the `NEXT_PUBLIC_API_URL` environment variable.
* **Backend (FastAPI)**: CORS is set up to accept the frontend URL dynamically via the `FRONTEND_URL` environment variable. The database tables initialize automatically on startup.

---

## 🚀 Free Deployment Strategy

Here is a recommended completely free stack to deploy the application:

### 1. Database: Neon (or Render)
Since the backend uses PostgreSQL, you need a hosted Postgres database.
* **Service**: [Neon.tech](https://neon.tech/) (Generous free tier for serverless Postgres) or [Render PostgreSQL](https://render.com/) (Free for 90 days).
* **Action**: Create a project, copy the connection string. It will look something like `postgresql://user:password@host/dbname`.

### 2. Backend: Render
Render has a great free tier for Python web services.
* **Service**: [Render Web Service](https://render.com/)
* **Steps**:
  1. Connect your GitHub repository to Render and create a new **Web Service**.
  2. **Root Directory**: `backend`
  3. **Build Command**: `pip install -r requirements.txt`
  4. **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
  5. **Environment Variables**:
     * `DATABASE_URL`: *(Paste the URL from Neon)*
     * `SECRET_KEY`: *(Generate a secure random string)*
     * `FRONTEND_URL`: *(You will set this AFTER deploying the frontend, temporarily set to `*` or leave blank)*
* **Note**: Render's free tier spins down after 15 minutes of inactivity; the first request after spinning down might take ~50 seconds to wake up.

### 3. Frontend: Vercel
Vercel is the creator of Next.js and offers the absolute best free hosting for it.
* **Service**: [Vercel](https://vercel.com/)
* **Steps**:
  1. Connect your GitHub repository to Vercel and import the project.
  2. **Framework Preset**: Next.js
  3. **Root Directory**: `frontend`
  4. **Environment Variables**:
     * `NEXT_PUBLIC_API_URL`: *(Paste the live backend URL you got from Render, e.g., `https://jobsync-backend.onrender.com`)*
  5. Click **Deploy**.

### Post-Deployment Step
Once Vercel gives you your live frontend URL (e.g., `https://jobsync.vercel.app`), go back to your **Render Backend** settings and update the `FRONTEND_URL` environment variable to match the Vercel URL. This ensures CORS allows your frontend to talk to your backend securely.
