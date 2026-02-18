import { Briefcase } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
    className?: string;
    iconSize?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', iconSize = 'md' }: LogoProps) {
    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    return (
        <Link href="/" className={`flex items-center gap-2 group ${className}`}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-shadow">
                <Briefcase className={`${iconSizes[iconSize]} text-white`} />
            </div>
            <span className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                Job<span className="text-emerald-500">Sync</span>
            </span>
        </Link>
    );
}
