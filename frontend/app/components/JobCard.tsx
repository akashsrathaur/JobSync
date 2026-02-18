'use client';

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
    posted_date?: string;
}

interface JobCardProps {
    job: Job;
    onViewDetails: (job: Job) => void;
    onSave: (jobId: string) => void;
    isSaved?: boolean;
}

export default function JobCard({ job, onViewDetails, onSave, isSaved = false }: JobCardProps) {
    const getScoreClass = (score: number) => {
        if (score >= 80) return 'score-excellent';
        if (score >= 60) return 'score-good';
        if (score >= 40) return 'score-fair';
        return 'score-poor';
    };

    const getScoreBorderClass = (score: number) => {
        if (score >= 80) return 'border-l-emerald-500';
        if (score >= 60) return 'border-l-blue-500';
        if (score >= 40) return 'border-l-amber-500';
        return 'border-l-red-500';
    };

    return (
        <div className={`job-card border-l-4 ${getScoreBorderClass(job.match_score || 0)} group`}>
            <div className="flex justify-between items-start mb-4">
                {/* Company Logo Placeholder */}
                <div className="flex gap-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-indigo-600">
                            {job.company.charAt(0)}
                        </span>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                            {job.title}
                        </h3>
                        <p className="text-lg text-slate-600 font-medium">{job.company}</p>

                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {job.location || 'Remote'}
                            </span>

                            {job.salary_min && job.salary_max && (
                                <span className="flex items-center gap-1 font-semibold text-emerald-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    ₹{((job.salary_min * 83) / 100000).toFixed(1)}L - ₹{((job.salary_max * 83) / 100000).toFixed(1)} LPA
                                </span>
                            )}

                            {job.job_type && (
                                <span className="badge-primary">{job.job_type}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Match Score */}
                {job.match_score !== undefined && (
                    <div className="flex flex-col items-end gap-2">
                        <div className={`px-5 py-3 rounded-xl font-bold text-2xl border-2 ${getScoreClass(job.match_score)}`}>
                            {job.match_score.toFixed(0)}%
                        </div>
                        <span className="text-xs text-slate-500 font-medium">Match Score</span>
                    </div>
                )}
            </div>

            {/* Skills Tags */}
            {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.slice(0, 6).map((skill, index) => (
                        <span key={index} className="skill-tag-matched">
                            {skill}
                        </span>
                    ))}
                    {job.skills.length > 6 && (
                        <span className="skill-tag">+{job.skills.length - 6} more</span>
                    )}
                </div>
            )}

            {/* Score Breakdown */}
            {job.score_breakdown && (
                <div className="mb-4">
                    <div className="grid grid-cols-5 gap-3">
                        {Object.entries(job.score_breakdown).map(([key, value]) => (
                            <div key={key} className="text-center">
                                <div className="progress-bar mb-1">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${value}%` }}
                                    />
                                </div>
                                <div className="text-xs text-slate-500 capitalize">
                                    {key.replace('_', ' ')}
                                </div>
                                <div className="text-sm font-semibold text-slate-700">
                                    {value.toFixed(0)}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                    onClick={() => onViewDetails(job)}
                    className="btn-primary flex-1"
                >
                    View Details
                </button>
                <button
                    onClick={() => onSave(job.id)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${isSaved
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                >
                    {isSaved ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    )}
                </button>
                <button className="px-6 py-3 rounded-lg font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all duration-200">
                    Apply
                </button>
            </div>
        </div>
    );
}
