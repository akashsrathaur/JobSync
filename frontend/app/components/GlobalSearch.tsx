'use client';

import { useState } from 'react';

interface GlobalSearchProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    loading?: boolean;
}

export default function GlobalSearch({ onSearch, placeholder = "Search jobs from multiple platforms...", loading = false }: GlobalSearchProps) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full group">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-1 sm:pl-4 flex items-center pointer-events-none">
                    <svg className={`h-5 w-5 transition-colors ${loading ? 'text-blue-500 animate-spin' : 'text-slate-400 group-focus-within:text-blue-500'}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24">
                        {loading ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        )}
                    </svg>
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    disabled={loading}
                    className="w-full h-12 sm:h-14 pl-10 sm:pl-12 pr-24 sm:pr-32 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm sm:text-base font-medium placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
                />
                <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="absolute inset-y-1.5 right-1.5 px-4 sm:px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>
            
            {/* Minimalist Hint */}
            <div className="hidden sm:flex items-center gap-4 mt-3 ml-2 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                <span className="flex items-center gap-1"><span className="w-1 h-1 bg-green-500 rounded-full"></span> Adzuna</span>
                <span className="flex items-center gap-1"><span className="w-1 h-1 bg-blue-500 rounded-full"></span> JSearch</span>
                <span className="flex items-center gap-1"><span className="w-1 h-1 bg-indigo-500 rounded-full"></span> LinkedIn</span>
            </div>
        </form>
    );
}
