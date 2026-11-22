import Link from 'next/link';
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-stone-200 bg-stone-100/60 mt-20 text-xs text-stone-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Philosophy */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-stone-900 text-stone-50 flex items-center justify-center font-mono text-[10px] font-bold">
                JS
              </div>
              <span className="font-semibold text-stone-900 text-sm">JobSync India</span>
            </div>
            <p className="text-stone-500 leading-relaxed text-xs max-w-md">
              Recruiter-grade resume diagnostics and truthful tailoring for Indian software engineers and tech professionals.
              Zero AI buzzwords, zero fabricated metrics, and transparent India unit economics.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[11px] font-mono text-stone-500">
              <span>GST Registered</span>
              <span>•</span>
              <span>18% Tax Compliant</span>
              <span>•</span>
              <span>DPDP Act 2023 Aligned</span>
            </div>
          </div>

          {/* Product & Navigation */}
          <div>
            <h4 className="font-semibold text-stone-900 mb-2.5">Product & Guides</h4>
            <ul className="space-y-1.5 text-stone-600">
              <li>
                <Link href="/workspace" className="hover:text-stone-900">
                  Diagnostic Workspace
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-stone-900">
                  India Plans & Pricing (INR)
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-stone-900">
                  Usage & Data Purge
                </Link>
              </li>
              <li>
                <a href="#economics" className="hover:text-stone-900">
                  AI Token Economics Math
                </a>
              </li>
            </ul>
          </div>

          {/* India Payment & Security */}
          <div>
            <h4 className="font-semibold text-stone-900 mb-2.5">Payments & Infrastructure</h4>
            <div className="space-y-2">
              <p className="text-[11px] text-stone-500">
                Secured by Razorpay. Supports UPI (Google Pay, PhonePe, Paytm), RuPay, Visa, Mastercard, and Netbanking.
              </p>
              <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                <span className="px-1.5 py-0.5 bg-stone-200 text-stone-700 rounded">UPI</span>
                <span className="px-1.5 py-0.5 bg-stone-200 text-stone-700 rounded">RuPay</span>
                <span className="px-1.5 py-0.5 bg-stone-200 text-stone-700 rounded">Netbanking</span>
                <span className="px-1.5 py-0.5 bg-stone-200 text-stone-700 rounded">Cards</span>
              </div>
              <p className="text-[10px] text-stone-400 font-mono pt-1">
                Reference FX: 1 USD = ₹92.68
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} JobSync India. Built with Next.js, Google Gemini, and PostgreSQL.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/account" className="hover:text-stone-800">
              Permanent Privacy Deletion
            </Link>
            <span>•</span>
            <span className="font-mono text-emerald-700">Zero-Hallucination Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
