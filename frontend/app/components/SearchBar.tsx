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
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
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
                        className="search-input pl-12"
                    />
                </div>

                {/* Sort Dropdown */}
                <div className="md:w-48">
                    <select
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="input-field"
                    >
                        <option value="best_match">Best Match</option>
                        <option value="newest">Newest First</option>
                        <option value="salary_high">Highest Salary</option>
                        <option value="salary_low">Lowest Salary</option>
                    </select>
                </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
                <button className="filter-chip">
                    <span>🏠</span>
                    <span>Remote</span>
                </button>
                <button className="filter-chip">
                    <span>💰</span>
                    <span>$100k+</span>
                </button>
                <button className="filter-chip">
                    <span>⚡</span>
                    <span>Entry Level</span>
                </button>
                <button className="filter-chip">
                    <span>🎯</span>
                    <span>Full-time</span>
                </button>
            </div>
        </div>
    );
}
