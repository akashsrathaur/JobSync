'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '../../../lib/api-client';
import { API_ENDPOINTS } from '../../../lib/config';

function VerifyOTPContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    useEffect(() => {
        if (!email) {
            router.push('/auth/signup');
        }
    }, [email, router]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value) {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && e.currentTarget.previousSibling) {
                (e.currentTarget.previousSibling as HTMLInputElement).focus();
            }
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) {
            setError('Please enter the full 6-digit code');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await fetch(API_ENDPOINTS.verifyOtp, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Verification failed');
            }

            const data = await response.json();
            apiClient.setTokens(data.access_token, data.refresh_token);
            router.push('/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setMessage('');
        setResending(true);

        try {
            const response = await fetch(`${API_ENDPOINTS.resendOtp}?email=${encodeURIComponent(email)}`, {
                method: 'POST',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to resend OTP');
            }

            setMessage('A new OTP has been sent to your email.');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center px-6">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <Link href="/" className="text-3xl font-bold text-slate-900 inline-block">
                        <span className="text-blue-500">Job</span>Sync
                    </Link>
                    <h1 className="text-3xl font-bold mt-6 text-slate-800">Verify your email</h1>
                    <p className="text-slate-600 mt-2">
                        Enter the 6-digit code sent to <span className="font-semibold text-slate-800">{email}</span>
                    </p>
                </div>

                <div className="glass-card">
                    <form onSubmit={handleVerify} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                                {message}
                            </div>
                        )}

                        <div className="flex justify-between gap-2">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    className="w-12 h-12 text-center text-xl font-bold bg-white/50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    value={data}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-600">
                        Didn&apos;t receive the code?{' '}
                        <button
                            onClick={handleResend}
                            disabled={resending}
                            className="text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50"
                        >
                            {resending ? 'Sending...' : 'Resend OTP'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function VerifyOTPPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyOTPContent />
        </Suspense>
    );
}
