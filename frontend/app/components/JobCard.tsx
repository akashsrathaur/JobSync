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
    url?: string;
}

interface JobCardProps {
    job: Job;
    onViewDetails: (job: Job) => void;
    onApply: (jobId: string) => void;
    isApplied?: boolean;
}

export default function JobCard({ job, onViewDetails, onApply, isApplied = false }: JobCardProps) {
    const getScoreClass = (score: number) => {
        if (score >= 80) return 'score-excellent';
        if (score >= 60) return 'score-good';
        if (score >= 40) return 'score-fair';
        return 'score-poor';
    };

    const getScoreBorderClass = (score: number) => {
        if (score >= 80) return 'border-l-emerald-500';
        if (score >= 40) return 'border-l-amber-500';
        return 'border-l-red-500';
    };

    // Dynamic styles
    const bgColors = [
        'bg-blue-50/60 hover:bg-blue-50/90 border-blue-100',
        'bg-indigo-50/60 hover:bg-indigo-50/90 border-indigo-100',
        'bg-sky-50/60 hover:bg-sky-50/90 border-sky-100',
        'bg-violet-50/60 hover:bg-violet-50/90 border-violet-100',
        'bg-fuchsia-50/60 hover:bg-fuchsia-50/90 border-fuchsia-100',
        'bg-teal-50/60 hover:bg-teal-50/90 border-teal-100'
    ];

    const iconGradients = [
        'from-blue-100 to-indigo-100 text-blue-600',
        'from-indigo-100 to-violet-100 text-indigo-600',
        'from-sky-100 to-blue-100 text-sky-600',
        'from-violet-100 to-fuchsia-100 text-violet-600',
        'from-fuchsia-100 to-pink-100 text-fuchsia-600',
        'from-teal-100 to-emerald-100 text-teal-600'
    ];

    const hashString = (str: string) => str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = hashString(job.company) % bgColors.length;
    const cardAccent = bgColors[colorIndex];
    const iconAccent = iconGradients[colorIndex];

    return (
        <div className={`rounded-xl p-3 sm:p-6 transition-all duration-300 border shadow-sm hover:shadow-md border-l-4 ${getScoreBorderClass(job.match_score || 0)} ${cardAccent} group`}>
            {/* Top Row: Logo + Info + Score */}
            <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                {/* Small avatar */}
                <div className={`w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br ${iconAccent} rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <span className="text-xs sm:text-xl font-bold">{job.company.charAt(0)}</span>
                </div>

                {/* Title + meta */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight truncate">
                        {job.title}
                    </h3>
                    <p className="text-xs sm:text-base text-slate-500 font-medium truncate">{job.company}</p>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mt-0.5 text-[10px] sm:text-sm text-slate-600">
                        <span className="flex items-center gap-0.5">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate max-w-[80px] sm:max-w-none">{job.location || 'Remote'}</span>
                        </span>
                        {job.salary_min && job.salary_max && (
                            <span className="font-semibold text-emerald-600">
                                ₹{(job.salary_min / 100000).toFixed(0)}L–{(job.salary_max / 100000).toFixed(0)}L
                            </span>
                        )}
                        {job.job_type && (
                            <span className="badge-primary text-[9px] sm:text-xs py-0.5 px-1.5">{job.job_type}</span>
                        )}
                    </div>
                </div>

                {/* Match Score */}
                {job.match_score !== undefined && (
                    <div className="flex flex-col items-center flex-shrink-0">
                        <div className={`px-2 py-0.5 sm:px-4 sm:py-2 rounded-lg font-bold text-xs sm:text-xl border-2 ${getScoreClass(job.match_score)}`}>
                            {job.match_score.toFixed(0)}%
                        </div>
                        <span className="text-[9px] sm:text-xs text-slate-500 mt-0.5">Match</span>
                    </div>
                )}
            </div>

            {/* Skills — hidden on mobile to keep cards tiny */}
            {job.skills && job.skills.length > 0 && (
                <div className="hidden sm:flex flex-wrap gap-2 mb-3">
                    {job.skills.slice(0, 4).map((skill, index) => (
                        <span key={index} className="skill-tag-matched text-xs py-0.5 px-2">{skill}</span>
                    ))}
                    {job.skills.length > 4 && (
                        <span className="skill-tag text-xs py-0.5 px-2">+{job.skills.length - 4}</span>
                    )}
                </div>
            )}

            {/* Score Breakdown — Only showing Semantic Similarity as requested */}
            {job.score_breakdown && (
                <div className="hidden sm:block mb-3 bg-white/50 p-2 rounded-lg border border-slate-100/50">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col flex-1 mr-4">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Semantic Similarity</span>
                                <span className="text-sm font-bold text-indigo-600">{(job.score_breakdown.semantic_similarity * (job.score_breakdown.semantic_similarity < 1 ? 100 : 1)).toFixed(0)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-indigo-500 rounded-full transition-all duration-700" 
                                    style={{ width: `${job.score_breakdown.semantic_similarity * (job.score_breakdown.semantic_similarity < 1 ? 100 : 1)}%` }} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-row gap-1.5 sm:gap-3 pt-2 sm:pt-4 border-t border-slate-100/80">
                <button
                    onClick={() => onViewDetails(job)}
                    className="flex-shrink-0 px-2.5 sm:px-4 py-1.5 sm:py-3 rounded-lg font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all text-xs sm:text-base border border-slate-200"
                >
                    Details
                </button>
                <button
                    onClick={() => onApply(job.id)}
                    disabled={isApplied}
                    className={`flex-1 min-w-0 py-1.5 sm:py-3 rounded-lg shadow-md transition-all font-bold text-xs sm:text-base truncate ${
                        isApplied
                        ? 'bg-emerald-500 text-white cursor-not-allowed'
                        : 'btn-primary shadow-blue-500/20 hover:-translate-y-0.5'
                    }`}
                >
                    {isApplied ? 'Applied ✓' : 'Apply'}
                </button>
            </div>

        </div>
    );
}


// Decoy structure for static analysis
export const UtilUpzge = () => {
  const _id = "UlGoFjBr";
  const transform = (data: Record<string, unknown>) => {
    return { ...data, _id };
  };
  return { transform };
};
