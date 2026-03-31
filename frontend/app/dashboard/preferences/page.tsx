'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../../lib/api-client';
import { API_ENDPOINTS } from '../../../lib/config';
import Logo from '../../components/Logo';
import { ArrowLeft, Save, Briefcase, MapPin, DollarSign, Settings, CheckCircle, AlertCircle } from 'lucide-react';

interface Preferences {
    desired_role: string;
    desired_skills: string[];
    experience_level: string;
    location: string;
    min_salary: number;
    max_salary: number;
}

export default function PreferencesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    const [formData, setFormData] = useState<Preferences>({
        desired_role: '',
        desired_skills: [],
        experience_level: 'entry',
        location: '',
        min_salary: 50000,
        max_salary: 150000
    });
    
    // For handling skills input as comma separated
    const [skillsText, setSkillsText] = useState('');

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            const data = await apiClient.get<Preferences>(API_ENDPOINTS.preferences);
            setFormData({
                desired_role: data.desired_role || '',
                desired_skills: data.desired_skills || [],
                experience_level: data.experience_level || 'entry',
                location: data.location || '',
                min_salary: data.min_salary || 50000,
                max_salary: data.max_salary || 150000
            });
            setSkillsText((data.desired_skills || []).join(', '));
        } catch (error: unknown) {
            // It's expected to fail if user hasn't created preferences yet (404)
            const err = error as { response?: { status: number } };
            if (err.response?.status !== 404) {
                 console.error("Failed to load preferences", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSkillsText(e.target.value);
        const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
        setFormData(prev => ({ ...prev, desired_skills: skillsArray }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await apiClient.post(API_ENDPOINTS.preferences, formData);
            setMessage({ type: 'success', text: 'Job preferences saved successfully!' });
        } catch (error: unknown) {
            setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to save preferences' });
        } finally {
            setSaving(false);
            // Hide success message after 3 seconds
            setTimeout(() => {
                setMessage(prev => prev.type === 'success' ? { type: '', text: '' } : prev);
            }, 3000);
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
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Settings className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">Job Preferences</h1>
                            <p className="text-slate-500">Fine-tune the AI job matching engine with your specific requirements.</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        {message.text && (
                            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2 ${
                                message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                                {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                            
                            {/* Role & Level */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-slate-400" />
                                        Desired Role
                                    </label>
                                    <input 
                                        type="text" 
                                        className="input-field"
                                        placeholder="e.g. Frontend Developer"
                                        value={formData.desired_role}
                                        onChange={(e) => setFormData({ ...formData, desired_role: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-slate-400" />
                                        Experience Level
                                    </label>
                                    <select 
                                        className="input-field"
                                        value={formData.experience_level}
                                        onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                                    >
                                        <option value="entry">Entry Level (0-2 years)</option>
                                        <option value="mid">Mid Level (2-5 years)</option>
                                        <option value="senior">Senior Level (5+ years)</option>
                                        <option value="lead">Lead / Staff</option>
                                        <option value="executive">Executive / VP</option>
                                    </select>
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    Preferred Location
                                </label>
                                <input 
                                    type="text" 
                                    className="input-field"
                                    placeholder="e.g. Remote, San Francisco, New York"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>

                            {/* Salary */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-slate-400" />
                                    Target Salary Range (USD)
                                </label>
                                <div className="grid grid-cols-2 gap-4 items-center">
                                    <div>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                            <input 
                                                type="number" 
                                                className="input-field pl-8"
                                                min="0"
                                                step="5000"
                                                value={formData.min_salary}
                                                onChange={(e) => setFormData({ ...formData, min_salary: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1 pl-1">Minimum Base</div>
                                    </div>
                                    <div>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                            <input 
                                                type="number" 
                                                className="input-field pl-8"
                                                min={formData.min_salary}
                                                step="5000"
                                                value={formData.max_salary}
                                                onChange={(e) => setFormData({ ...formData, max_salary: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1 pl-1">Maximum Base</div>
                                    </div>
                                </div>
                            </div>

                            {/* Skills */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Target Skills <span className="text-slate-400 font-normal">(Comma separated)</span>
                                </label>
                                <input 
                                    type="text" 
                                    className="input-field"
                                    placeholder="e.g. React, Python, PostgreSQL"
                                    value={skillsText}
                                    onChange={handleSkillsChange}
                                />
                                {formData.desired_skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {formData.desired_skills.map((skill, index) => (
                                            <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={saving}
                                    className="btn-primary min-w-[200px] flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Update Preferences
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
