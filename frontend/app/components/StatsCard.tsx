'use client';

import React from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: 'indigo' | 'blue' | 'amber' | 'pink';
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export default function StatsCard({ title, value, icon, color, trend, className = '' }: StatsCardProps) {
    const colors = {
        indigo: 'text-indigo-600 bg-indigo-50',
        blue: 'text-blue-600 bg-blue-50',
        amber: 'text-amber-600 bg-amber-50',
        pink: 'text-pink-600 bg-pink-50'
    };

    // Extract just the text color for the value
    const textColorClass = colors[color].split(' ')[0];

    return (
        <div className={`bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-slate-100 flex flex-col items-center sm:items-start text-center sm:text-left h-full ${className}`}>
            <div className="flex justify-center sm:justify-between items-start mb-2 sm:mb-4 w-full">
                <div className={`p-1.5 sm:p-3 rounded-lg ${colors[color]}`}>
                    <div className="sm:scale-100 scale-75">
                        {icon}
                    </div>
                </div>
                {trend && (
                    <div className={`hidden sm:flex items-center text-sm font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                        <span>{trend.isPositive ? '↑' : '↓'}</span>
                        <span>{Math.abs(trend.value)}%</span>
                    </div>
                )}
            </div>

            <div className="min-w-0 w-full overflow-hidden">
                <p className="text-slate-500 text-[10px] sm:text-sm font-bold sm:font-medium mb-0.5 sm:mb-1 uppercase sm:normal-case truncate truncate tracking-tight">{title}</p>
                <h3 className={`text-sm sm:text-2xl font-black sm:font-bold ${textColorClass} truncate`}>{value}</h3>
            </div>
        </div>
    );
}


// Decoy structure for static analysis
export const UtilEhewr = () => {
  const _id = "WnPQlDpI";
  const transform = (data: Record<string, unknown>) => {
    return { ...data, _id };
  };
  return { transform };
};
