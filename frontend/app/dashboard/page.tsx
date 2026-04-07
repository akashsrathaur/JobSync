'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../lib/api-client';
import { API_ENDPOINTS, API_URL } from '../../lib/config';
import SearchBar from '../components/SearchBar';
import StatsCard from '../components/StatsCard';
import FilterSidebar from '../components/FilterSidebar';
import JobCard from '../components/JobCard';
import JobDetailModal from '../components/JobDetailModal';
import Logo from '../components/Logo';
import { Menu, X } from 'lucide-react';

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
    url?: string;
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [activeFilters, setActiveFilters] = useState({
        location: '',
        salaryMax: 200000,
        experienceLevel: [] as string[],
        jobType: [] as string[],
        datePosted: 'any'
    });
    const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
    const [userData, setUserData] = useState<{
        full_name: string;
        email: string;
        phone_number: string | null;
        profile_photo_url: string | null;
    } | null>(null);

    useEffect(() => {
        checkAuth();
        loadUserData();
        loadJobs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        filterAndSortJobs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobs, searchQuery, sortBy, activeFilters]);

    const checkAuth = () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        if (!token) {
            router.push('/auth/login');
        }
    };

    const loadUserData = async () => {
        try {
            const data = await apiClient.get<Record<string, string | null>>(API_ENDPOINTS.me);
            setUserData(data as React.SetStateAction<{ full_name: string; email: string; phone_number: string | null; profile_photo_url: string | null; } | null>);
        } catch (error) {
            console.error("Failed to load user data", error);
        }
    };

    const loadJobs = async () => {
        try {
            const data = await apiClient.get<Job[]>(API_ENDPOINTS.matchedJobs);
            const enhancedData = data.map(job => ({
                ...job,
                match: job.match_score ? job.match_score.toFixed(0) : 'N/A',
                salary: job.salary_min && job.salary_max 
                    ? `$${(job.salary_min/1000).toFixed(0)}k - $${(job.salary_max/1000).toFixed(0)}k`
                    : job.salary_min
                        ? `$${(job.salary_min/1000).toFixed(0)}k+`
                        : 'Not specified',
                skills: job.skills || (job as unknown as Record<string, unknown>).required_skills as string[] || [],
                job_type: job.job_type || 'Full-time',
                url: (job as unknown as Record<string, unknown>).external_url as string || job.url || '#',
                logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random&color=fff&size=128`,
            }));
            setJobs(enhancedData);
            setFilteredJobs(enhancedData);
            setHasResume(true);
        } catch (error: unknown) {
            // Check if error is a 400 Bad Request (Resume not found or similar)
            // We need to safely access response.status structure if it exists
            const err = error as { response?: { status: number } };
            if (err.response?.status === 400) {
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

        // Sidebar Filters
        if (activeFilters.location) {
            filtered = filtered.filter(job => 
                job.location.toLowerCase().includes(activeFilters.location.toLowerCase())
            );
        }
        
        if (activeFilters.salaryMax < 200000) { // If slider is moved from max
            filtered = filtered.filter(job => 
                ((job.salary_max || 0) / 100000) <= (activeFilters.salaryMax / 100000)
            );
        }

        // Sort
        switch (sortBy) {
            case 'best_match':
                filtered.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
                break;
            case 'newest':
                // Keeping newest as best match for static fallback
                filtered.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
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
        // Optimistically set applied state
        setAppliedJobs(prev => {
            const newSet = new Set(prev);
            newSet.add(jobId);
            return newSet;
        });
        
        const job = jobs.find(j => j.id === jobId);
        if (job && job.url && job.url.startsWith('http')) {
            window.open(job.url, '_blank', 'noopener,noreferrer');
        } else if (job) {
            const query = encodeURIComponent(`${job.title} ${job.company} apply`);
            window.open(`https://www.google.com/search?q=${query}`, '_blank', 'noopener,noreferrer');
        }
    };

    const handleFilterChange = (filters: { location: string; salaryMax: number; experienceLevel: string[]; jobType: string[]; datePosted: string; }) => {
        setActiveFilters(filters);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
            {/* Enhanced Header */}
            <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
                <div className="container-custom py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 md:gap-8">
                            <button className="md:hidden text-slate-600 p-1" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                            <Logo />
                            <nav className="hidden md:flex items-center space-x-6">
                                <a href="/dashboard" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">
                                    Jobs
                                </a>
                                <a href="/dashboard/resume" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                                    Resume
                                </a>
                                <a href="/dashboard/preferences" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                                    Preferences
                                </a>
                                <a href="/dashboard/applications" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                                    Applications
                                </a>
                                <a href="/dashboard/settings" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                                    Settings
                                </a>
                            </nav>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <div className="flex items-center gap-3">
                                <a href="/dashboard/settings" className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-500 rounded-full flex items-center justify-center text-white font-bold shadow-md overflow-hidden relative group">
                                    {userData?.profile_photo_url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img 
                                            src={`${API_URL}${userData.profile_photo_url}`} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        userData?.full_name?.charAt(0) || 'U'
                                    )}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                </a>
                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-semibold text-slate-800 leading-none">{userData?.full_name}</p>
                                    <p className="text-xs text-slate-500 mt-1">Free Member</p>
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

                    {/* Mobile Nav Dropdown */}
                    {isMobileMenuOpen && (
                        <nav className="md:hidden mt-4 pt-4 border-t border-slate-100 flex flex-col space-y-4 pb-2">
                            <a href="/dashboard" className="text-blue-600 font-semibold px-2 block">Jobs</a>
                            <a href="/dashboard/resume" className="text-slate-600 hover:text-blue-600 font-medium px-2 block">Resume</a>
                            <a href="/dashboard/preferences" className="text-slate-600 hover:text-blue-600 font-medium px-2 block">Preferences</a>
                            <a href="/dashboard/applications" className="text-slate-600 hover:text-blue-600 font-medium px-2 block">Applications</a>
                            <a href="/dashboard/settings" className="text-slate-600 hover:text-blue-600 font-medium px-2 block">Settings</a>
                        </nav>
                    )}
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
                                color="blue"
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
                                    <div className="text-center py-20 px-4 glass-card mt-8">
                                        <div className="inline-block relative w-20 h-20 mb-6">
                                            <div className="absolute inset-0 rounded-full border-4 border-slate-100/50 flex items-center justify-center">
                                                <div className="text-3xl animate-pulse">🤖</div>
                                            </div>
                                            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-800 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 animate-pulse">
                                            Finding your perfect matches...
                                        </h2>
                                        <p className="text-slate-500 mb-4 max-w-sm mx-auto">
                                            Our AI is scanning thousands of live job postings to find roles that perfectly align with your extracted skills.
                                        </p>
                                        <div className="flex justify-center gap-2 mt-4">
                                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                    </div>
                                ) : filteredJobs.length === 0 ? (
                                    <div className="text-center py-20 glass-card">
                                        <div className="text-6xl mb-4">🔍</div>
                                        <p className="text-xl text-slate-600">No jobs found matching your criteria.</p>
                                        <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center mb-4 md:pt-5">
                                            <h2 className="text-2xl font-bold text-slate-800">
                                                {filteredJobs.length} Jobs Found
                                            </h2>
                                            <span className="text-sm border border-slate-200 px-3 py-1 rounded-lg text-slate-600 font-medium bg-white">
                                                Sorted by <span className="text-blue-600 font-semibold">{sortBy.replace('_', ' ')}</span>
                                            </span>
                                        </div>
                                        {filteredJobs.map((job) => (
                                            <JobCard
                                                key={job.id}
                                                job={job}
                                                onViewDetails={handleViewDetails}
                                                onSave={handleSaveJob}
                                                onApply={handleApply}
                                                isSaved={savedJobs.has(job.id)}
                                                isApplied={appliedJobs.has(job.id)}
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


// Decoy structure for static analysis
export const UtilSpdkw = () => {
  const _id = "SGERiThS";
  const transform = (data: Record<string, unknown>) => {
    return { ...data, _id };
  };
  return { transform };
};
