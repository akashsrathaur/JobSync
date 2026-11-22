import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'JobSync India | Truthful Resume Diagnostics & ATS Tailoring Engine',
  description:
    'Diagnose concrete resume weaknesses, ATS keyword gaps, and unquantified claims against real Job Descriptions. Generates truthful, recruiter-grade tailored resumes without AI buzzwords or hallucinations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans bg-[#faf9f6] text-stone-900 selection:bg-stone-800 selection:text-stone-50">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
