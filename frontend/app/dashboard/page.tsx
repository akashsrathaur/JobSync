'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/config';
import SearchBar from '../components/SearchBar';
import StatsCard from '../components/StatsCard';
import FilterSidebar from '../components/FilterSidebar';
import JobCard from '../components/JobCard';
import JobDetailModal from '../components/JobDetailModal';
import Logo from '../components/Logo';

import {
    Target,
    FileText,
    Bookmark,
    Award,
    Briefcase,
    MapPin,
    DollarSign,
    Clock,
    CheckCircle2
} from 'lucide-react';

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
    skills?: string[];
    job_type?: string;
    description?: string;
    requirements?: string[];
    benefits?: string[];
}

export default function DashboardPage() {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasResume, setHasResume] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('best_match');

    useEffect(() => {
        checkAuth();
        loadJobs();
    }, []);

    useEffect(() => {
        filterAndSortJobs();
    }, [jobs, searchQuery, sortBy]);

    const checkAuth = () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        if (!token) {
            router.push('/auth/login');
        }
    };

    const loadJobs = async () => {
        try {
            const data = await apiClient.get<Job[]>(API_ENDPOINTS.matchedJobs);
            // Add mock data for better demonstration
            const enhancedData = data.map(job => ({
                ...job,
                salary_min: job.salary_min ? job.salary_min * 83 : 1200000, // Convert to INR approx
                salary_max: job.salary_max ? job.salary_max * 83 : 1800000,
                skills: job.skills || ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
                job_type: job.job_type || 'Full-time',
                description: 'Join our dynamic team and work on cutting-edge projects that make a real impact. We offer competitive compensation, flexible work arrangements, and opportunities for professional growth.',
                requirements: [
                    '3+ years of experience in software development',
                    'Strong problem-solving and analytical skills',
                    'Excellent communication and teamwork abilities',
                    'Bachelor\'s degree in Computer Science or related field'
                ],
                benefits: [
                    'Health Insurance',
                    'Remote Work',
                    'Provident Fund',
                    'Professional Development',
                    'Flexible Hours',
                    'Performance Bonus'
                ]
            }));
            setJobs(enhancedData);
            setFilteredJobs(enhancedData);
            setHasResume(true);
        } catch (error: any) {
            if (error.response?.status === 400) {
                setHasResume(false);
            }
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortJobs = () => {
        let filtered = [...jobs];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Sort
        switch (sortBy) {
            case 'best_match':
                filtered.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
                break;
            case 'newest':
                // Would sort by date if available
                break;
            case 'salary_high':
                filtered.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
                break;
            case 'salary_low':
                filtered.sort((a, b) => (a.salary_min || 0) - (b.salary_min || 0));
                break;
        }

        setFilteredJobs(filtered);
    };

    const handleLogout = () => {
        apiClient.clearTokens();
        router.push('/');
    };

    const handleViewDetails = (job: Job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const handleSaveJob = (jobId: string) => {
        setSavedJobs(prev => {
            const newSet = new Set(prev);
            if (newSet.has(jobId)) {
                newSet.delete(jobId);
            } else {
                newSet.add(jobId);
            }
            return newSet;
        });
    };

    const handleApply = (jobId: string) => {
        console.log('Applying to job:', jobId);
        // Would integrate with applications API
    };

    const handleFilterChange = (filters: any) => {
        console.log('Filters changed:', filters);
        // Would apply filters to jobs list
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            {/* Enhanced Header */}
            <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
                <div className="container-custom py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-8">
                            <Logo />
                            <nav className="hidden md:flex items-center space-x-6">
                                <a href="/dashboard" className="text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1">
                                    Jobs
                                </a>
                                <a href="/dashboard/resume" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                                    Resume
                                </a>
                                <a href="/dashboard/preferences" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                                    Preferences
                                </a>
                                <a href="/dashboard/applications" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                                    Applications
                                </a>
                            </nav>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                    A
                                </div>
                                <button onClick={handleLogout} className="text-slate-600 hover:text-red-600 font-medium transition-colors flex items-center gap-2">
                                    <span>Logout</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container-custom py-8">
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
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <StatsCard
                                title="Total Matches"
                                value={filteredJobs.length}
                                icon="🎯"
                                color="indigo"
                                trend={{ value: 12, isPositive: true }}
                            />
                            <StatsCard
                                title="Applications"
                                value="8"
                                icon="📝"
                                color="emerald"
                                trend={{ value: 5, isPositive: true }}
                            />
                            <StatsCard
                                title="Saved Jobs"
                                value={savedJobs.size}
                                icon="💾"
                                color="amber"
                            />
                            <StatsCard
                                title="Profile Score"
                                value="85%"
                                icon="⭐"
                                color="pink"
                                trend={{ value: 3, isPositive: true }}
                            />
                        </div>

                        {/* Search Bar */}
                        <SearchBar
                            onSearch={setSearchQuery}
                            onSortChange={setSortBy}
                        />

                        {/* Main Content */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Filter Sidebar */}
                            <div className="lg:col-span-1">
                                <FilterSidebar onFilterChange={handleFilterChange} />
                            </div>

                            {/* Jobs List */}
                            <div className="lg:col-span-3">
                                {loading ? (
                                    <div className="text-center py-20">
                                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
                                        <p className="mt-4 text-slate-600 font-medium">Finding your perfect matches...</p>
                                    </div>
                                ) : filteredJobs.length === 0 ? (
                                    <div className="text-center py-20 glass-card">
                                        <div className="text-6xl mb-4">🔍</div>
                                        <p className="text-xl text-slate-600">No jobs found matching your criteria.</p>
                                        <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-2xl font-bold text-slate-800">
                                                {filteredJobs.length} Jobs Found
                                            </h2>
                                            <span className="text-sm text-slate-600">
                                                Sorted by {sortBy.replace('_', ' ')}
                                            </span>
                                        </div>
                                        {filteredJobs.map((job) => (
                                            <JobCard
                                                key={job.id}
                                                job={job}
                                                onViewDetails={handleViewDetails}
                                                onSave={handleSaveJob}
                                                isSaved={savedJobs.has(job.id)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* Job Detail Modal */}
            <JobDetailModal
                job={selectedJob}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onApply={handleApply}
            />
        </div>
    );
}
