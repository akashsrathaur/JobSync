/**
 * Project: JobSync
 * Author: Akash S Rathaur
 * Module: Frontend UI Components
 */

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
                <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-start">
                    <div className="flex gap-4 flex-1">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-3xl font-bold text-indigo-600">
                                {job.company.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">{job.title}</h2>
                            <p className="text-xl text-slate-600 font-medium mb-2">{job.company}</p>
                            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                                <span className="flex items-center gap-1">
                                    📍 {job.location || 'Remote'}
                                </span>
                                {job.salary_min && job.salary_max && (
                                    <span className="flex items-center gap-1 font-semibold text-emerald-600">
                                        💰 ₹{(job.salary_min / 100000).toFixed(1)}L - ₹{(job.salary_max / 100000).toFixed(1)} LPA
                                    </span>
                                )}
                                {job.job_type && (
                                    <span className="badge-primary">{job.job_type}</span>
                                )}
                                {job.experience_level && (
                                    <span className="badge-primary">{job.experience_level}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    {job.match_score !== undefined && (
                        <div className="bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-xl p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-800">Your Match Score</h3>
                                <div className={`text-5xl font-bold ${getScoreColor(job.match_score)}`}>
                                    {job.match_score.toFixed(0)}%
                                </div>
                            </div>

                            {job.score_breakdown && (
                                <div className="grid grid-cols-5 gap-4">
                                    {Object.entries(job.score_breakdown).map(([key, value]) => (
                                        <div key={key} className="text-center">
                                            <div className="mb-2">
                                                <div className="w-16 h-16 mx-auto rounded-full bg-white flex items-center justify-center shadow-md">
                                                    <span className={`text-2xl font-bold ${getScoreColor(value)}`}>
                                                        {value.toFixed(0)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-xs text-slate-600 capitalize font-medium">
                                                {key.replace('_', ' ')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-3">About the Role</h3>
                        <p className="text-slate-600 leading-relaxed">
                            {job.description || 'We are looking for a talented professional to join our team. This is an exciting opportunity to work on challenging projects and grow your career.'}
                        </p>
                    </div>

                    {job.requirements && job.requirements.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Requirements</h3>
                            <ul className="space-y-2">
                                {job.requirements.map((req, index) => (
                                    <li key={index} className="flex items-start gap-2 text-slate-600">
                                        <span className="text-emerald-500 mt-1">✓</span>
                                        <span>{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {job.skills && job.skills.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Required Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill, index) => (
                                    <span key={index} className="skill-tag-matched">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {job.benefits && job.benefits.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Benefits</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {job.benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-2 text-slate-600">
                                        <span className="text-indigo-500">★</span>
                                        <span>{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex gap-4">
                    <button
                        onClick={() => onApply(job.id)}
                        className="btn-primary flex-1 text-lg py-4"
                    >
                        Apply Now
                    </button>
                    <button className="px-8 py-4 rounded-lg font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all duration-200">
                        Save Job
                    </button>
                    <button className="px-8 py-4 rounded-lg font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all duration-200">
                        Share
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
