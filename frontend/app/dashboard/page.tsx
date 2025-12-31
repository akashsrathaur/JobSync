'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/config';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    salary_min?: number;
    salary_max?: number;
    match_score?: number;
    score_breakdown?: {
        skill_match: number;
        semantic_similarity: number;
        experience_match: number;
        location_match: number;
        salary_match: number;
    };
}

export default function DashboardPage() {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasResume, setHasResume] = useState(false);

    useEffect(() => {
        checkAuth();
        loadJobs();
    }, []);

    const checkAuth = () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        if (!token) {
            router.push('/auth/login');
        }
    };

    const loadJobs = async () => {
        try {
            const data = await apiClient.get<Job[]>(API_ENDPOINTS.matchedJobs);
            setJobs(data);
            setHasResume(true);
        } catch (error: any) {
            if (error.response?.status === 400) {
                setHasResume(false);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        apiClient.clearTokens();
        router.push('/');
    };

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-emerald-600 bg-emerald-50';
        if (score >= 40) return 'text-amber-600 bg-amber-50';
        return 'text-red-600 bg-red-50';
    };

    const getScoreBorderColor = (score: number) => {
        if (score >= 70) return 'border-emerald-200';
        if (score >= 40) return 'border-amber-200';
        return 'border-red-200';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                            JobSync
                        </div>
                        <nav className="flex items-center space-x-6">
                            <a href="/dashboard" className="text-slate-700 hover:text-indigo-600 font-medium">Jobs</a>
                            <a href="/dashboard/resume" className="text-slate-700 hover:text-indigo-600 font-medium">Resume</a>
                            <a href="/dashboard/preferences" className="text-slate-700 hover:text-indigo-600 font-medium">Preferences</a>
                            <a href="/dashboard/applications" className="text-slate-700 hover:text-indigo-600 font-medium">Applications</a>
                            <button onClick={handleLogout} className="text-slate-600 hover:text-red-600 font-medium">
                                Logout
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                {!hasResume && !loading ? (
                    <div className="max-w-2xl mx-auto text-center py-20">
                        <div className="glass-card">
                            <div className="text-6xl mb-6">📄</div>
                            <h2 className="text-3xl font-bold mb-4 text-slate-800">Upload Your Resume</h2>
                            <p className="text-slate-600 mb-8">
                                To see personalized job matches, please upload your resume first.
                            </p>
                            <a href="/dashboard/resume" className="btn-primary inline-block">
                                Upload Resume →
                            </a>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-slate-800 mb-2">Your Matched Jobs</h1>
                            <p className="text-slate-600">Jobs ranked by AI compatibility score</p>
                        </div>

                        {loading ? (
                            <div className="text-center py-20">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                                <p className="mt-4 text-slate-600">Loading your matches...</p>
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="text-center py-20 glass-card">
                                <p className="text-slate-600">No jobs found. Try updating your preferences.</p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {jobs.map((job) => (
                                    <div
                                        key={job.id}
                                        className={`card hover:scale-[1.02] transition-transform duration-200 border-l-4 ${getScoreBorderColor(job.match_score || 0)}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-slate-800 mb-1">{job.title}</h3>
                                                        <p className="text-lg text-slate-600">{job.company}</p>
                                                    </div>
                                                    {job.match_score !== undefined && (
                                                        <div className={`px-4 py-2 rounded-lg font-bold text-2xl ${getScoreColor(job.match_score)}`}>
                                                            {job.match_score.toFixed(0)}%
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                                                    <span className="flex items-center gap-1">
                                                        📍 {job.location || 'Remote'}
                                                    </span>
                                                    {job.salary_min && job.salary_max && (
                                                        <span className="flex items-center gap-1">
                                                            💰 ${(job.salary_min / 1000).toFixed(0)}k - ${(job.salary_max / 1000).toFixed(0)}k
                                                        </span>
                                                    )}
                                                </div>

                                                {job.score_breakdown && (
                                                    <div className="grid grid-cols-5 gap-2 mt-4">
                                                        {Object.entries(job.score_breakdown).map(([key, value]) => (
                                                            <div key={key} className="text-center">
                                                                <div className="text-xs text-slate-500 mb-1 capitalize">
                                                                    {key.replace('_', ' ')}
                                                                </div>
                                                                <div className="text-sm font-semibold text-slate-700">
                                                                    {value.toFixed(0)}%
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4 flex gap-3">
                                            <button className="btn-primary flex-1">View Details</button>
                                            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-6 rounded-lg transition-all duration-200">
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
