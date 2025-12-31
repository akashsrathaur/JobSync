# JobSync Frontend

AI-powered job matching platform frontend built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern, responsive UI with Tailwind CSS
- 🔐 JWT authentication with auto-refresh
- 📊 AI match score visualization
- 📱 Mobile-friendly design
- ⚡ Server-side rendering with Next.js App Router

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Hooks

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:

Create a `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=JobSync
```

3. **Run development server**:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── app/
│   ├── auth/
│   │   ├── login/          # Login page
│   │   └── signup/         # Signup page
│   ├── dashboard/
│   │   ├── page.tsx        # Main dashboard with job listings
│   │   ├── resume/         # Resume upload
│   │   ├── preferences/    # Job preferences
│   │   └── applications/   # Application tracking
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── lib/
│   ├── api-client.ts       # Axios client with interceptors
│   └── config.ts           # API configuration
└── components/             # Reusable components
```

## Pages

### Landing Page (`/`)
- Hero section with features
- How it works
- Call to action

### Authentication
- `/auth/signup` - User registration
- `/auth/login` - User login

### Dashboard (`/dashboard`)
- Job listings with AI match scores
- Score breakdown visualization
- Color-coded compatibility indicators

### Resume (`/dashboard/resume`)
- Resume upload interface
- AI parsing feedback
- File validation

### Preferences (`/dashboard/preferences`)
- Job search preferences
- Location, salary, role settings

### Applications (`/dashboard/applications`)
- Track applied jobs
- Application status updates

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_API_URL`: Your backend API URL
   - Deploy!

### Manual Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.jobsync.com` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `JobSync` |

## Development

### Code Style
```bash
# Format code
npm run lint
```

### Build
```bash
npm run build
```

## License

MIT
