import Link from 'next/link';

interface LogoProps {
    className?: string;
    iconSize?: 'sm' | 'md' | 'lg'; // Kept for prop compatibility, but unused visually
}

export default function Logo({ className = '' }: LogoProps) {
    return (
        <Link href="/" className={`flex items-center group ${className}`}>
            <span className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                <span className="text-blue-500">Job</span>Sync
            </span>
        </Link>
    );
}
