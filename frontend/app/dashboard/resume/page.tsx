'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/lib/config';
import { apiClient } from '@/lib/api-client';

export default function ResumePage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            // Validate file type
            if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
                setError('Only PDF files are supported');
                return;
            }

            // Validate file size (5MB)
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }

            setFile(selectedFile);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const token = localStorage.getItem('access_token');
            const response = await fetch(API_ENDPOINTS.resumeUpload, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Upload failed');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
            <header className="bg-white border-b border-slate-200 shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                            JobSync
                        </div>
                        <a href="/dashboard" className="text-slate-700 hover:text-indigo-600 font-medium">
                            ← Back to Dashboard
                        </a>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold text-slate-800 mb-4">Upload Your Resume</h1>
                    <p className="text-slate-600 mb-8">
                        Our AI will analyze your resume to extract skills, experience, and education.
                    </p>

                    <div className="glass-card">
                        {success ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">✅</div>
                                <h2 className="text-2xl font-bold text-emerald-600 mb-2">Resume Uploaded!</h2>
                                <p className="text-slate-600">Redirecting to your matches...</p>
                            </div>
                        ) : (
                            <>
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-indigo-400 transition-colors">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="resume-upload"
                                    />
                                    <label htmlFor="resume-upload" className="cursor-pointer">
                                        <div className="text-6xl mb-4">📄</div>
                                        <p className="text-lg font-medium text-slate-700 mb-2">
                                            {file ? file.name : 'Click to upload your resume'}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            PDF only, max 5MB
                                        </p>
                                    </label>
                                </div>

                                {error && (
                                    <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                        {error}
                                    </div>
                                )}

                                {file && (
                                    <div className="mt-6">
                                        <button
                                            onClick={handleUpload}
                                            disabled={uploading}
                                            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {uploading ? 'Uploading and parsing...' : 'Upload Resume'}
                                        </button>
                                    </div>
                                )}

                                <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
                                    <h3 className="font-semibold text-slate-800 mb-2">What we extract:</h3>
                                    <ul className="space-y-1 text-sm text-slate-600">
                                        <li>✓ Technical skills and technologies</li>
                                        <li>✓ Work experience and job titles</li>
                                        <li>✓ Education and degrees</li>
                                        <li>✓ Contact information</li>
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
