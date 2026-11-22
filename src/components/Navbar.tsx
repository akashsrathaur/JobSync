'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { UserSession } from '@/types/api';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSession(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const navLinks = [
    { href: '/', label: 'Overview' },
    { href: '/workspace', label: 'Tailoring Workspace' },
    { href: '/pricing', label: 'India Pricing & Unit Economics' },
    { href: '/account', label: 'Account & Privacy' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-stone-50/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded bg-stone-900 text-stone-50 flex items-center justify-center font-mono font-bold text-sm tracking-tighter">
              JS
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-stone-900 text-sm tracking-tight flex items-center gap-1.5">
                JobSync
                <span className="text-[10px] font-mono px-1 py-0.2 bg-stone-200 text-stone-700 rounded">
                  India
                </span>
              </span>
              <span className="text-[10px] text-stone-500 hidden sm:block -mt-1 font-mono">
                Truthful ATS & Weakness Diagnostic
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs px-2.5 py-1.5 rounded font-medium transition-colors ${
                    isActive
                      ? 'bg-stone-200/80 text-stone-900 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action & Credits Badge */}
        <div className="flex items-center gap-3">
          {session && (
            <div className="flex items-center gap-2 bg-stone-100 border border-stone-200 px-2.5 py-1 rounded text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span className="text-stone-600">Runs:</span>
              <span className="font-bold text-stone-900">{session.creditsRemaining}</span>
              <span className="text-[10px] text-stone-400">({session.tier})</span>
            </div>
          )}

          <Link
            href="/workspace"
            className="text-xs bg-stone-900 hover:bg-stone-800 text-stone-50 px-3 py-1.5 rounded font-medium transition shadow-sm"
          >
            Open Workspace →
          </Link>
        </div>
      </div>
    </header>
  );
};
