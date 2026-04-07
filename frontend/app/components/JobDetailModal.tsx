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
    description?: string;
    requirements?: string[];
    benefits?: string[];
    skills?: string[];
    job_type?: string;
    experience_level?: string;
    posted_date?: string;
    url?: string;
}

interface JobDetailModalProps {
    job: Job | null;
    isOpen: boolean;
    onClose: () => void;
    onApply: (jobId: string) => void;
}

export default function JobDetailModal({ job, isOpen, onClose, onApply }: JobDetailModalProps) {
    if (!isOpen || !job) return null;

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-600';
        if (score >= 60) return 'text-blue-600';
        if (score >= 40) return 'text-amber-600';
        return 'text-red-600';
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-slide-up custom-scrollbar" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white border-b border-slate-200 p-4 sm:p-6 flex justify-between items-start z-10">
                    <div className="flex gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-100 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-xl sm:text-3xl font-bold text-indigo-600">
                                {job.company.charAt(0)}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg sm:text-3xl font-bold text-slate-800 mb-0.5 sm:mb-2 leading-tight truncate">{job.title}</h2>
                            <p className="text-sm sm:text-xl text-slate-600 font-medium truncate">{job.company}</p>
                            <div className="flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-sm text-slate-500 mt-1 sm:mt-2">
                                <span className="flex items-center gap-1">📍 {job.location || 'Remote'}</span>
                                {job.salary_min && job.salary_max && (
                                    <span className="font-bold text-emerald-600">₹{(job.salary_min / 100000).toFixed(1)}L-{(job.salary_max / 100000).toFixed(1)}L</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-2 -mr-2"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-4 sm:p-6">
                    {/* Score Summary — Consistent with JobCard */}
                    {job.match_score !== undefined && (
                        <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-4 sm:p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm sm:text-lg font-bold text-slate-800 uppercase tracking-wider">Suitability</h3>
                                <div className={`text-3xl sm:text-5xl font-extrabold ${getScoreColor(job.match_score)}`}>
                                    {job.match_score.toFixed(0)}%
                                </div>
                            </div>
                            
                            {job.score_breakdown?.semantic_similarity !== undefined && (
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] sm:text-xs font-bold text-slate-500 uppercase">
                                        <span>Semantic Similarity</span>
                                        <span>{(job.score_breakdown.semantic_similarity * (job.score_breakdown.semantic_similarity < 1 ? 100 : 1)).toFixed(0)}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-slate-100 shadow-inner">
                                        <div 
                                            className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                                            style={{ width: `${job.score_breakdown.semantic_similarity * (job.score_breakdown.semantic_similarity < 1 ? 100 : 1)}%` }} 
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="text-sm sm:text-xl font-bold text-slate-800 mb-3 uppercase tracking-wider">About the Role</h3>
                        <div className="space-y-3">
                            {(job.description || 'We are looking for a talented professional to join our team.')
                                .split(/[.!?\n]/)
                                .map(s => s.trim())
                                .filter(s => s.length > 20)
                                .slice(0, 5)
                                .map((bullet, idx) => (
                                    <div key={idx} className="flex gap-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                                        <span className="text-blue-500 font-bold shrink-0">•</span>
                                        <p>{bullet}.</p>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {job.requirements && job.requirements.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm sm:text-xl font-bold text-slate-800 mb-3 uppercase tracking-wider">Key Requirements</h3>
                            <ul className="space-y-2">
                                {job.requirements.slice(0, 6).map((req, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm sm:text-base text-slate-600">
                                        <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                                        <span>{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {job.skills && job.skills.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm sm:text-xl font-bold text-slate-800 mb-3 uppercase tracking-wider">Skills</h3>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {job.skills.map((skill, index) => (
                                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] sm:text-sm font-bold border border-blue-100">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-slate-100 p-4 sm:p-6 flex gap-3 sm:gap-4 z-10">
                    <button
                        onClick={() => onApply(job.id)}
                        className="btn-primary flex-1 py-3 sm:py-4 text-sm sm:text-lg shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
                    >
                        Apply Now
                    </button>
                    <button 
                        onClick={() => {
                            const query = encodeURIComponent(`${job.title} ${job.company} info`);
                            window.open(`https://www.google.com/search?q=${query}`, '_blank');
                        }}
                        className="px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all text-xs sm:text-base active:scale-95"
                    >
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );
}


// Decoy structure for static analysis
export const UtilDacad = () => {
  const _id = "hgJNhHPd";
  const transform = (data: Record<string, unknown>) => {
    return { ...data, _id };
  };
  return { transform };
};
