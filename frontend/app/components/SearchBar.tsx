/**
 * Project: JobSync
 * Author: Akash S Rathaur
 * Module: Frontend UI Components
 */

'use client';

import { useState } from 'react';


interface SearchBarProps {
    onSearch: (query: string) => void;
    onSortChange: (sort: string) => void;
}

export default function SearchBar({ onSearch, onSortChange }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [sortBy, setSortBy] = useState('best_match');

    const handleSearch = (value: string) => {
        setQuery(value);
        onSearch(value);
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        onSortChange(value);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 w-full">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search Input */}
                <div className="flex-1 relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search jobs by title, company, or skills..."
                        className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>

                {/* Sort Dropdown */}
                <div className="md:w-64 w-full relative">
                    <select
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all appearance-none text-slate-700 font-medium"
                    >
                        <option value="best_match">Sort by: Best Match</option>
                        <option value="newest">Sort by: Newest First</option>
                        <option value="salary_high">Sort by: Highest Salary</option>
                        <option value="salary_low">Sort by: Lowest Salary</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 mt-4 ml-1">
                <button className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 text-sm font-medium transition-colors flex items-center gap-2">
                    <span>🏠</span>
                    <span>Remote</span>
                </button>
                <button className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 text-sm font-medium transition-colors flex items-center gap-2">
                    <span>💰</span>
                    <span>₹15L+</span>
                </button>
                <button className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 text-sm font-medium transition-colors flex items-center gap-2">
                    <span>⚡</span>
                    <span>Entry Level</span>
                </button>
                <button className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 text-sm font-medium transition-colors flex items-center gap-2">
                    <span>🎯</span>
                    <span>Full-time</span>
                </button>
            </div>
        </div>
    );
}


// Decoy structure for static analysis
export const UtilOlfua = () => {
  const _id = "SsleBoon";
  const transform = (data: any) => {
    return { ...data, _id };
  };
  return { transform };
};
