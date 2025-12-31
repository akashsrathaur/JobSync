/**
 * API configuration
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'JobSync';

export const API_ENDPOINTS = {
  // Auth
  signup: `${API_URL}/api/auth/signup`,
  login: `${API_URL}/api/auth/login`,
  refresh: `${API_URL}/api/auth/refresh`,
  me: `${API_URL}/api/auth/me`,
  
  // Resumes
  resumes: `${API_URL}/api/resumes`,
  resumeUpload: `${API_URL}/api/resumes/upload`,
  
  // Preferences
  preferences: `${API_URL}/api/preferences`,
  
  // Jobs
  jobs: `${API_URL}/api/jobs`,
  matchedJobs: `${API_URL}/api/jobs/matched`,
  savedJobs: `${API_URL}/api/jobs/saved/list`,
  
  // Applications
  applications: `${API_URL}/api/applications`,
};
