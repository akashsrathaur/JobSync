'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../../lib/api-client';
import { API_ENDPOINTS } from '../../../lib/config';
import Logo from '../../components/Logo';
import { ArrowLeft, Clock, MapPin, Building, Briefcase } from 'lucide-react';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    salary_min?: number;
    salary_max?: number;
    experience_required?: string;
}

interface Application {
    id: string;
    status: string;
    applied_at: string;
    job?: Job;
}

export default function ApplicationsPage() {
    const router = useRouter();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            const data = await apiClient.get<Application[]>(API_ENDPOINTS.applications);
            setApplications(data);
        } catch (error) {
            console.error("Failed to load applications", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'applied':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'interviewing':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'accepted':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'rejected':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="container-custom py-4 flex justify-between items-center">
                    <Logo />
                    <button 
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                </div>
            </header>

            <main className="container-custom py-10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-slate-800 mb-8">My Applications</h1>

                    {applications.length === 0 ? (
                        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
                            <div className="text-5xl mb-4">🚀</div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">No applications yet</h2>
                            <p className="text-slate-500 mb-6">You haven't applied to any jobs yet. Head back to the dashboard to find your perfect match!</p>
                            <button 
                                onClick={() => router.push('/dashboard')}
                                className="btn-primary"
                            >
                                Browse Jobs
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {applications.map((app) => (
                                <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <span className="text-xl font-bold text-slate-400">
                                                    {app.job?.company?.charAt(0) || 'C'}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-800 mb-1">
                                                    {app.job?.title || 'Unknown Role'}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-3">
                                                    <span className="flex items-center gap-1 font-medium text-slate-700">
                                                        <Building className="w-4 h-4" />
                                                        {app.job?.company || 'Unknown Company'}
                                                    </span>
                                                    {app.job?.location && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" />
                                                            {app.job.location}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        Applied: {new Date(app.applied_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {app.job?.salary_min && (
                                                        <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md border border-green-100 flex items-center gap-1">
                                                            ${Math.floor(app.job.salary_min / 1000)}k{app.job.salary_max ? ` - $${Math.floor(app.job.salary_max / 1000)}k` : '+'}
                                                        </span>
                                                    )}
                                                    {app.job?.experience_required && (
                                                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md flex items-center gap-1">
                                                            <Briefcase className="w-3 h-3" />
                                                            {app.job.experience_required} years
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end min-w-[120px]">
                                            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border uppercase tracking-wider ${getStatusStyle(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
