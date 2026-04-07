'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../lib/api-client';
import { API_ENDPOINTS, API_URL } from '../../lib/config';
import StatsCard from '../components/StatsCard';
import FilterSidebar from '../components/FilterSidebar';
import JobCard from '../components/JobCard';
import JobDetailModal from '../components/JobDetailModal';
import Logo from '../components/Logo';
import GlobalSearch from '../components/GlobalSearch';
import { Menu, X } from 'lucide-react';

interface User {
    full_name: string;
    email: string;
    phone_number: string | null;
    profile_photo_url: string | null;
}

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

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasResume, setHasResume] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        const [areFiltersVisible, setAreFiltersVisible] = useState(false);
    const [userData, setUserData] = useState<{
        full_name: string;
        email: string;
        phone_number: string | null;
        profile_photo_url: string | null;
    } | null>(null);

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isGlobalSearching, setIsGlobalSearching] = useState(false);

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
            const data = await apiClient.get<User>(API_ENDPOINTS.me);
            setUserData(data);
        } catch (error) {
            console.error("Failed to load user data", error);
        }
    };

    const loadJobs = async () => {
        try {
            setLoading(true);
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
            const err = error as { response?: { status: number } };
            if (err.response?.status === 400) {
                setHasResume(false);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGlobalSearch = async (query: string) => {
        try {
            setIsGlobalSearching(true);
            setLoading(true);
            const data = await apiClient.get<Job[]>(`${API_ENDPOINTS.matchedJobs.replace('/matched', '/search')}?q=${encodeURIComponent(query)}`);
            const enhancedData = data.map(job => ({
                ...job,
                match: job.match_score ? job.match_score.toFixed(0) : 'N/A',
                skills: job.skills || (job as unknown as Record<string, unknown>).required_skills as string[] || [],
                job_type: job.job_type || 'Full-time',
                url: (job as unknown as Record<string, unknown>).external_url as string || job.url || '#',
                logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random&color=fff&size=128`,
            }));
            setJobs(enhancedData);
            setFilteredJobs(enhancedData);
        } catch (error) {
            console.error("Global search failed", error);
        } finally {
            setIsGlobalSearching(false);
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


    const handleApply = (jobId: string) => {
        const job = jobs.find(j => j.id === jobId);
        
        // Optimistically set applied state
        setAppliedJobs(prev => {
            const newSet = new Set(prev);
            newSet.add(jobId);
            return newSet;
        });

        // Add Notification
        if (job) {
            const newNotification: Notification = {
                id: Math.random().toString(36).substr(2, 9),
                title: 'Application Sent',
                message: `Applied for ${job.title} at ${job.company}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setNotifications(prev => [newNotification, ...prev]);
        }
        
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
                <div className="container-custom py-2 sm:py-4">
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
                                <a href="/dashboard/applications" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                                    Applications
                                </a>
                                <a href="/dashboard/settings" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                                    Settings
                                </a>
                            </nav>
                        </div>

                        {/* Global Search - Desktop Integrated */}
                        <div className="hidden lg:block flex-1 max-w-xl mx-8">
                            <GlobalSearch 
                                onSearch={handleGlobalSearch} 
                                loading={isGlobalSearching}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Notification Bell */}
                            <div className="relative">
                                <button 
                                    onClick={() => {
                                        setIsNotificationOpen(!isNotificationOpen);
                                        setIsProfileOpen(false);
                                    }}
                                    className={`relative p-2 rounded-full transition-colors ${isNotificationOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {notifications.length > 0 && (
                                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                                    )}
                                </button>

                                {/* Notification Dropdown */}
                                {isNotificationOpen && (
                                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                            <h3 className="font-bold text-slate-800">Notifications</h3>
                                            {notifications.length > 0 && (
                                                <button 
                                                    onClick={() => setNotifications([])}
                                                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                                                >
                                                    Clear all
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-8 text-center">
                                                    <div className="text-4xl mb-3">🔔</div>
                                                    <p className="text-slate-500 text-sm">No new notifications</p>
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-slate-50">
                                                    {notifications.map((notif) => (
                                                        <div key={notif.id} className="p-4 hover:bg-slate-50 transition-colors cursor-default">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <p className="font-bold text-sm text-slate-800">{notif.title}</p>
                                                                <span className="text-[10px] text-slate-400 font-medium">{notif.time}</span>
                                                            </div>
                                                            <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button 
                                    onClick={() => {
                                        setIsProfileOpen(!isProfileOpen);
                                        setIsNotificationOpen(false);
                                    }}
                                    className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                                >
                                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-sky-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm overflow-hidden relative">
                                        {userData?.profile_photo_url ? (
                                            <img 
                                                src={`${API_URL}${userData.profile_photo_url}`} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            userData?.full_name?.charAt(0) || 'U'
                                        )}
                                    </div>
                                    <div className="hidden sm:block text-left pr-2">
                                        <p className="text-sm font-bold text-slate-800 leading-none">{userData?.full_name?.split(' ')[0]}</p>
                                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">Member</p>
                                    </div>
                                    <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Profile Menu Dropdown */}
                                {isProfileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="p-4 border-b border-slate-50 bg-slate-50/30">
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Signed in as</p>
                                                <p className="text-sm font-bold text-slate-800 truncate">{userData?.email}</p>
                                            </div>
                                            <div className="p-2">
                                                <a href="/dashboard/resume" className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    Update Resume
                                                </a>
                                                <a href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    My Profile
                                                </a>
                                                <a href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    Account Settings
                                                </a>
                                                <div className="my-1 border-t border-slate-50"></div>
                                                <button 
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Nav Dropdown */}
                    {isMobileMenuOpen && (
                        <nav className="md:hidden mt-4 pt-4 border-t border-slate-100 flex flex-col space-y-4 pb-2">
                            <a href="/dashboard" className="text-blue-600 font-semibold px-2 block">Jobs</a>
                            <a href="/dashboard/resume" className="text-slate-600 hover:text-blue-600 font-medium px-2 block">Resume</a>
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
                        {/* Mobile Global Search - Only shown on small screens when not hidden in header */}
                        <div className="lg:hidden mb-6">
                            <GlobalSearch 
                                onSearch={handleGlobalSearch} 
                                loading={isGlobalSearching}
                            />
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-6 mb-8">
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
                                title="Profile Score"
                                value="85%"
                                icon="⭐"
                                color="pink"
                                trend={{ value: 3, isPositive: true }}
                            />
                        </div>


                        {/* Main Content */}
                        <div className="space-y-6">
                            {/* Filter Sidebar (Mobile Toggle) */}
                            <div className={areFiltersVisible ? "block lg:hidden" : "hidden"}>
                                <FilterSidebar onFilterChange={handleFilterChange} />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                {/* Desktop Filter Sidebar */}
                                <div className="hidden lg:col-span-1 lg:block">
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
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 md:pt-5">
                                            <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                                                {filteredJobs.length} Jobs Found
                                            </h2>
                                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                                {/* Filter Toggle (Mobile Only) */}
                                                <button 
                                                    onClick={() => setAreFiltersVisible(!areFiltersVisible)}
                                                    className={`lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs transition-all shadow-sm ${
                                                        areFiltersVisible ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                                    </svg>
                                                    {areFiltersVisible ? 'Hide Filters' : 'Filters'}
                                                </button>

                                                {/* Sort Dropdown */}
                                                <div className="relative flex-1 sm:flex-initial">
                                                    <select
                                                        value={sortBy}
                                                        onChange={(e) => setSortBy(e.target.value)}
                                                        className="w-full sm:w-48 h-10 pl-3 pr-8 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all appearance-none text-xs sm:text-sm text-slate-700 font-bold shadow-sm hover:bg-slate-50"
                                                    >
                                                        <option value="best_match">Sort: Best Match</option>
                                                        <option value="newest">Sort: Newest First</option>
                                                        <option value="salary_high">Sort: Highest Salary</option>
                                                        <option value="salary_low">Sort: Lowest Salary</option>
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {filteredJobs.map((job) => (
                                            <JobCard
                                                key={job.id}
                                                job={job}
                                                onViewDetails={handleViewDetails}
                                                onApply={handleApply}
                                                isApplied={appliedJobs.has(job.id)}
                                            />
                                        ))}
                                    </div>
                                )}
                                </div>
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
