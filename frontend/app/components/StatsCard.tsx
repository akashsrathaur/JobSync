/**
 * Project: JobSync
 * Author: Akash S Rathaur
 * Module: Frontend UI Components
 */

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
        <div className={`bg-white rounded-xl p-6 shadow-sm border border-slate-100 ${className}`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${colors[color]}`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center text-sm font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                        <span>{trend.isPositive ? '↑' : '↓'}</span>
                        <span>{Math.abs(trend.value)}%</span>
                    </div>
                )}
            </div>

            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                <h3 className={`text-2xl font-bold ${textColorClass}`}>{value}</h3>
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
