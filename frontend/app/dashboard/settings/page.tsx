'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../../lib/api-client';
import { API_ENDPOINTS, API_URL } from '../../../lib/config';
import Logo from '../../components/Logo';
import { User, Phone, Mail, Camera, Save, ArrowLeft, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
    const router = useRouter();
    const [userData, setUserData] = useState<{
        full_name: string;
        email: string;
        phone_number: string | null;
        profile_photo_url: string | null;
    } | null>(null);
    
    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: '',
    });
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [photoLoading, setPhotoLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const data = await apiClient.get<Record<string, string | null>>(API_ENDPOINTS.me);
            setUserData(data as React.SetStateAction<{ full_name: string; email: string; phone_number: string | null; profile_photo_url: string | null; } | null>);
            setFormData({
                full_name: data.full_name || '',
                phone_number: data.phone_number || '',
            });
        } catch (error) {
            console.error("Failed to load user data", error);
            router.push('/auth/login');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const updatedUser = await apiClient.put<Record<string, string | null>>(API_ENDPOINTS.profileUpdate, formData);
            setUserData(updatedUser as React.SetStateAction<{ full_name: string; email: string; phone_number: string | null; profile_photo_url: string | null; } | null>);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: unknown) {
            setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPhotoLoading(true);
        setMessage({ type: '', text: '' });

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        try {
            const response = await fetch(API_ENDPOINTS.profilePhoto, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: uploadFormData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Photo upload failed');
            }

            const updatedUser = await response.json();
            setUserData(updatedUser);
            setMessage({ type: 'success', text: 'Profile photo updated!' });
        } catch (error: unknown) {
            setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to upload photo' });
        } finally {
            setPhotoLoading(false);
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
                    <h1 className="text-3xl font-bold text-slate-800 mb-8">Account Settings</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Profile Photo Section */}
                        <div className="md:col-span-1">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                                <div className="relative inline-block group mb-4">
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-md relative">
                                        {userData?.profile_photo_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img 
                                                src={`${API_URL}${userData.profile_photo_url}`} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-400 bg-slate-100">
                                                {userData?.full_name?.charAt(0)}
                                            </div>
                                        )}
                                        {photoLoading && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white shadow-lg cursor-pointer hover:bg-blue-700 transition-colors">
                                        <Camera className="w-4 h-4" />
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            disabled={photoLoading}
                                        />
                                    </label>
                                </div>
                                <h3 className="font-bold text-slate-800">{userData?.full_name}</h3>
                                <p className="text-sm text-slate-500">{userData?.email}</p>
                            </div>
                        </div>

                        {/* Profile Info Form */}
                        <div className="md:col-span-2">
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                                {message.text && (
                                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm ${
                                        message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                    }`}>
                                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : null}
                                        {message.text}
                                    </div>
                                )}

                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                            <User className="w-4 h-4 text-slate-400" />
                                            Full Name
                                        </label>
                                        <input 
                                            type="text" 
                                            className="input-field"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            Phone Number
                                        </label>
                                        <input 
                                            type="tel" 
                                            className="input-field"
                                            value={formData.phone_number}
                                            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                            placeholder="Enter your mobile number"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            Email Address
                                        </label>
                                        <input 
                                            type="email" 
                                            className="input-field bg-slate-50 cursor-not-allowed"
                                            value={userData?.email}
                                            disabled
                                        />
                                        <p className="text-xs text-slate-400 mt-2">Email cannot be changed.</p>
                                    </div>

                                    <div className="pt-4">
                                        <button 
                                            type="submit" 
                                            disabled={saving}
                                            className="btn-primary w-full flex items-center justify-center gap-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
