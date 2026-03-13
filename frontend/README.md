# JobSync Client Application

The client-side web application for JobSync, built to provide a modern interface for uploading resumes, tracking job matches, and managing user preferences.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Network**: Axios
- **Component Architecture**: React Server Components & Client Components

## Development Setup

1. **Installation**
   ```bash
   npm install
   ```

2. **Configuration**
   Create a `.env.local` file at the root of the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_APP_NAME=JobSync
   ```

3. **Running Locally**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

## Architecture Overview

- `app/`: Contains the Next.js routing logic, layouts, and page definitions.
  - `app/auth/`: Login and registration flows.
  - `app/dashboard/`: Authenticated user area, including metrics and matched jobs.
- `components/`: Reusable UI elements strictly adhering to the design system.
- `lib/`: Utility functions, including the configured Axios API client.

## Building for Production

Ensure your environment variables are set correctly for your production backend, then compile the application:

```bash
npm run build
npm start
```

## Author
**Akash S Rathaur** ([@akashsrathaur](https://github.com/akashsrathaur))
