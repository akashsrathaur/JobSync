# GitHub Push Instructions

## Quick Setup

1. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Repository name: `JobSync` (or your preferred name)
   - Description: "AI-powered job matching platform with FastAPI and Next.js"
   - Keep it **Public** or **Private** (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

2. **Push your code**:

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/JobSync.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Alternative: Using SSH

If you prefer SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/JobSync.git
git branch -M main
git push -u origin main
```

## Verify

After pushing, your repository will be available at:
`https://github.com/YOUR_USERNAME/JobSync`

## Next Steps After Push

### Deploy Backend (Render)
1. Go to https://render.com
2. Connect your GitHub account
3. Create new "Web Service"
4. Select your `JobSync` repository
5. Configure:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt && python -m spacy download en_core_web_sm`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables (see backend/.env.example)
7. Create PostgreSQL database in Render
8. Deploy!

### Deploy Frontend (Vercel)
1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure:
   - Root Directory: `frontend`
   - Framework Preset: Next.js
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL
5. Deploy!

## Repository Structure

Your GitHub repo will contain:
```
JobSync/
├── backend/          # FastAPI backend
├── frontend/         # Next.js frontend
├── README.md         # Project documentation
└── .gitignore        # Git ignore rules
```

## Troubleshooting

**If you get authentication errors**:
- Make sure you're logged into GitHub
- Use a Personal Access Token instead of password
- Or set up SSH keys

**If remote already exists**:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/JobSync.git
```

---

**Ready to push!** Just create the GitHub repository and run the commands above.
