import React from 'react';

interface ScoreBadgeProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  label = 'ATS Alignment',
  size = 'md',
}) => {
  // Editorial color coding based on realistic recruiter thresholds
  let colorClass = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let badgeText = 'Strong Match';

  if (score < 50) {
    colorClass = 'text-rose-700 bg-rose-50 border-rose-200';
    badgeText = 'Severe Gaps';
  } else if (score < 75) {
    colorClass = 'text-amber-700 bg-amber-50 border-amber-200';
    badgeText = 'Partial Match';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3.5 py-1.5 font-semibold',
  };

  return (
    <div className="inline-flex items-center gap-2">
      <div
        className={`inline-flex items-center gap-1.5 border font-mono rounded ${sizeClasses[size]} ${colorClass}`}
      >
        <span className="font-bold">{score}%</span>
        <span className="opacity-75">•</span>
        <span className="font-sans text-xs">{badgeText}</span>
      </div>
      {label && <span className="text-xs text-stone-500 font-medium">{label}</span>}
    </div>
  );
};
