'use client';

import { useState } from 'react';

interface FilterSidebarProps {
    onFilterChange: (filters: any) => void;
}

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
    const [filters, setFilters] = useState({
        location: '',
        salaryMin: 0,
        salaryMax: 200000,
        experienceLevel: [] as string[],
        jobType: [] as string[],
        datePosted: 'any',
    });

    const handleFilterChange = (key: string, value: any) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const toggleArrayFilter = (key: 'experienceLevel' | 'jobType', value: string) => {
        const current = filters[key];
        const newValue = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        handleFilterChange(key, newValue);
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Filters</h3>

            {/* Location */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Location
                </label>
                <input
                    type="text"
                    placeholder="City, State, or Remote"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="input-field"
                />
            </div>

            {/* Salary Range */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Salary Range
                </label>
                <div className="space-y-2">
                    <input
                        type="range"
                        min="0"
                        max="200000"
                        step="10000"
                        value={filters.salaryMax}
                        onChange={(e) => handleFilterChange('salaryMax', parseInt(e.target.value))}
                        className="w-full"
                    />
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>$0</span>
                        <span className="font-semibold text-indigo-600">
                            ${(filters.salaryMax / 1000).toFixed(0)}k+
                        </span>
                    </div>
                </div>
            </div>

            {/* Experience Level */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Experience Level
                </label>
                <div className="space-y-2">
                    {['Entry Level', 'Mid Level', 'Senior', 'Lead/Principal'].map((level) => (
                        <label key={level} className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.experienceLevel.includes(level)}
                                onChange={() => toggleArrayFilter('experienceLevel', level)}
                                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-slate-700">{level}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Job Type */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Job Type
                </label>
                <div className="space-y-2">
                    {['Full-time', 'Part-time', 'Contract', 'Remote', 'Hybrid'].map((type) => (
                        <label key={type} className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.jobType.includes(type)}
                                onChange={() => toggleArrayFilter('jobType', type)}
                                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-slate-700">{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Date Posted */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Date Posted
                </label>
                <select
                    value={filters.datePosted}
                    onChange={(e) => handleFilterChange('datePosted', e.target.value)}
                    className="input-field"
                >
                    <option value="any">Any Time</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                </select>
            </div>

            {/* Clear Filters */}
            <button
                onClick={() => {
                    const resetFilters = {
                        location: '',
                        salaryMin: 0,
                        salaryMax: 200000,
                        experienceLevel: [],
                        jobType: [],
                        datePosted: 'any',
                    };
                    setFilters(resetFilters);
                    onFilterChange(resetFilters);
                }}
                className="w-full btn-ghost text-sm"
            >
                Clear All Filters
            </button>
        </div>
    );
}
