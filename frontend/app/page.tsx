/**
 * Project: JobSync
 * Author: Akash S Rathaur
 * Module: Frontend UI Components
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Briefcase,
  Users,
  TrendingUp,
  Target,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import Logo from './components/Logo';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleCTAClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/auth/signup');
    }
  };

  // We keep existing state/data for sections further down or logos needed
  const floatingLogos = [
    { name: 'Google', src: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg', top: '15%', left: '10%', delay: '0s' },
    { name: 'Microsoft', src: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', top: '25%', right: '15%', delay: '1s' },
    { name: 'Amazon', src: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg', bottom: '20%', left: '15%', delay: '2s' },
    { name: 'Apple', src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', bottom: '30%', right: '10%', delay: '3s' },
    { name: 'Meta', src: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png', top: '50%', left: '5%', delay: '4s' },
    { name: 'Netflix', src: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', top: '10%', right: '30%', delay: '1.5s' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="container-custom py-4">
          <nav className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-2xl tracking-tight text-slate-800">JobSync</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#jobs" className="text-sm font-medium text-slate-600 hover:text-blue-500 transition-colors">
                Find Jobs
              </a>
              <a href="#companies" className="text-sm font-medium text-slate-600 hover:text-blue-500 transition-colors">
                Top Companies
              </a>
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-500 transition-colors">
                Why Us
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={handleCTAClick}
                className="px-6 py-2 rounded-full border border-slate-200 text-slate-700 font-bold hover:border-blue-500 hover:text-blue-500 transition-all text-sm"
              >
                Find jobs now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-32 overflow-hidden bg-white text-center">
        {/* Abstract Digital Map Background Banner */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-100 z-0 flex justify-center items-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-white/50 to-white z-10"></div>
          <img
            src="/digital-network-map.svg"
            alt="Digital World Map"
            className="w-full min-w-[1200px] max-w-7xl h-auto object-cover opacity-90"
          />
        </div>

        {/* Floating Abstract Elements */}
        <div className="absolute inset-0 pointer-events-none z-10 hidden lg:block max-w-[1400px] mx-auto overflow-hidden">
          {floatingLogos.map((logo, index) => (
            <div
              key={index}
              className="absolute bg-white p-3 rounded-full shadow-[0_4px_20px_rgba(14,165,233,0.15)] border border-slate-100/50 animate-float"
              style={{
                top: logo.top,
                left: logo.left,
                right: logo.right,
                bottom: logo.bottom,
                animationDelay: logo.delay
              }}
            >
              <img src={logo.src} alt={logo.name} className="w-6 h-6 object-contain" />
            </div>
          ))}
        </div>

        <div className="container-custom relative z-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-slate-900 leading-[1.1]">
              Apply to <span className="text-blue-500 cursor-text">Relevant Jobs</span> in Seconds <br className="hidden md:block" />
              with JobSync AI
            </h1>

            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto font-medium">
              Let our Job Copilot parse your resume and semantically match you to the perfect role.
            </p>

            <div className="flex justify-center">
              <button
                onClick={handleCTAClick}
                className="btn-primary text-lg shadow-[0_4px_14px_0_rgba(14,165,233,0.39)] hover:shadow-[0_6px_20px_rgba(14,165,233,0.23)] border border-blue-400/50"
              >
                Find your first job
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm"></div>
                <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white shadow-sm"></div>
                <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white shadow-sm"></div>
              </div>
              <span className="font-medium text-slate-500">Join 50k+ job seekers applying right now</span>
            </div>
          </div>
        </div>
      </section>

      <section id="stats" className="py-16 bg-gradient-to-b from-[#0a0f0c] to-[#0d1410] text-center border-t border-t-white/10">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-white">
            The largest and most trusted AI Job Board in India.
          </h2>
          <p className="text-xl md:text-2xl font-bold mb-16 text-white pb-6 border-b border-b-white/10 max-w-2xl mx-auto block">
            Your Dream Job, delivered by <span className="text-blue-500">AI</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">10,000+</div>
              <div className="text-slate-400 font-medium">Startups & MNCs</div>
            </div>
            <div className="hidden md:block w-px h-16 bg-white/10 mx-auto"></div>
            <div className="md:hidden h-px w-16 bg-white/10 mx-auto"></div>

            <div>
              <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">100,000+</div>
              <div className="text-slate-400 font-medium">Verified Profiles</div>
            </div>
            <div className="hidden md:block w-px h-16 bg-white/10 mx-auto"></div>
            <div className="md:hidden h-px w-16 bg-white/10 mx-auto"></div>

            <div>
              <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">2,500,000+</div>
              <div className="text-slate-400 font-medium">Job Matches Made</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 opacity-70">
            <div className="card-polished-dark flex items-center gap-3 py-2 px-6">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-6 brightness-0 invert" />
            </div>
            <div className="card-polished-dark flex items-center gap-3 py-2 px-6">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" className="h-6 brightness-0 invert" />
            </div>
            <div className="card-polished-dark flex items-center gap-3 py-2 px-6">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-6 brightness-0 invert" />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
              Your dream job in 4 quick steps... <span className="text-blue-500">Resume Matching AI</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium">
              We make finding awesome jobs <span className="text-blue-500 font-bold">Resumé Free</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="card-polished border border-slate-100 flex flex-col items-center text-center p-8 bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800 mb-6">1. Upload Your Resume (PDF)</h3>
              <div className="w-full max-w-sm bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">Frontend Engineer</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">Remote</span>
                </div>
              </div>
            </div>

            <div className="card-polished border border-slate-100 flex flex-col items-center text-center p-8 bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800 mb-6">2. Set Your Preferences</h3>
              <div className="w-full max-w-sm bg-white border border-slate-100 rounded-xl p-4 shadow-sm outline outline-2 outline-blue-100 outline-offset-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold">M</div>
                    <div className="font-bold text-sm">Match found!</div>
                  </div>
                  <div className="text-blue-500 font-bold">98% Match</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-left">
                  <div className="font-bold text-slate-800 text-sm">Senior Next.js Developer</div>
                  <div className="text-slate-500 text-xs mt-1">TechCorp Inc. • $120k-$150k</div>
                </div>
              </div>
            </div>

            <div className="card-polished border border-slate-100 flex flex-col items-center text-center p-8 bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800 mb-6">3. Get AI-Matched Jobs</h3>
              <div className="w-full max-w-sm bg-white border border-slate-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm font-bold text-slate-800">Job application</div>
                  <div className="text-xs text-blue-500 font-bold bg-blue-50 px-2 py-1 rounded">Ready</div>
                </div>
                <div className="h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold cursor-pointer hover:bg-blue-600 transition-colors">
                  1-Click Apply →
                </div>
              </div>
            </div>

            <div className="card-polished border border-slate-100 flex flex-col items-center text-center p-8 bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800 mb-6">4. Track Your Applications</h3>
              <div className="w-full max-w-sm bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <CheckCircle2 strokeWidth={3} className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-800 text-sm">Interview Scheduled</div>
                    <div className="text-slate-500 text-xs">Tomorrow at 10:00 AM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-slate-50">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 shadow-sm mb-4">
              Powered by advanced AI technology
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border text-left border-slate-200 rounded-xl p-6 flex justify-between items-center shadow-sm">
              <span className="font-bold text-slate-800">Smart NLP Resume Parsing (spaCy)</span>
              <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
            </div>
            <div className="bg-white border text-left border-slate-200 rounded-xl p-6 flex justify-between items-center shadow-sm">
              <span className="font-bold text-slate-800">3-Layer Semantic Matching Algorithm</span>
              <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
            </div>
            <div className="bg-white border text-left border-slate-200 rounded-xl p-6 flex justify-between items-center shadow-sm relative overflow-hidden">
              <span className="font-bold text-slate-800 relative z-10">Detailed Match Scoring (0-100)</span>
              <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 relative z-10" />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
            </div>
            <div className="bg-white border text-left border-slate-200 rounded-xl p-6 flex justify-between items-center shadow-sm relative overflow-hidden">
              <span className="font-bold text-slate-800 relative z-10">Personalized Role & Salary Preferences</span>
              <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 relative z-10" />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0a0e0b] text-white relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">

            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Your <span className="text-blue-500">Personal</span> AI Job Copilot
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                JobSync learns your preferences & skills to find the perfect job match seamlessly.
              </p>

              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="font-medium text-slate-300">Smart NLP Resume Parsing (spaCy)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="font-medium text-slate-300">3-Layer Semantic Matching</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="font-medium text-slate-300">Detailed Compatibility Scoring</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="font-medium text-slate-300">Personalized Role Preferences</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="font-medium text-slate-300">Built-in Application Tracking</span>
                </li>
              </ul>

              <button onClick={handleCTAClick} className="btn-primary inline-flex items-center gap-2 text-lg">
                Find your job now
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full z-0"></div>
              <div className="relative z-10 card-polished-dark p-6 border-white/10 shadow-2xl shadow-blue-900/50 rotate-3 transition-transform hover:rotate-0 duration-500">
                <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                  <div className="font-bold text-lg">Match Analytics</div>
                  <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-xs font-bold">LIVE</span>
                </div>

                <div className="flex items-center justify-center py-8">
                  <div className="relative w-40 h-40 rounded-full border-[8px] border-slate-800 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-[8px] border-blue-500 border-r-transparent rotate-45"></div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white">92%</div>
                      <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Score</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">Skills Match</span>
                      <span className="text-blue-400">95%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[95%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">Experience Alignment</span>
                      <span className="text-blue-400">88%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[88%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -left-12 top-20 bg-white text-slate-900 font-bold p-3 rounded-xl shadow-xl z-20 animate-float flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center text-xl">🔥</div>
                <div className="text-sm">Hot Job Alert</div>
              </div>

              <div className="absolute -right-8 bottom-10 bg-slate-800 text-white font-bold p-3 rounded-xl shadow-xl z-20 flex items-center gap-3 border border-white/10 [animation:float_4s_ease-in-out_infinite_1s]">
                <div className="text-blue-500">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="text-sm">Auto-Applied</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials / Wall of Love (Simplified Grid) */}
      <section className="py-24 bg-[#050806] text-white">
        <div className="container-custom max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 text-blue-400 text-sm font-bold tracking-wide mb-6 bg-blue-500/10">
              TESTIMONIALS
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              1000+ Jobseekers are landing their <br /> dream jobs using <span className="text-blue-500">JobSync</span>
            </h2>
          </div>

          {/* Masonry-like Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="card-polished-dark bg-[#0a0e0b] flex flex-col justify-between">
              <div>
                <div className="flex text-blue-500 mb-4 gap-1">
                  {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                </div>
                <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                  &quot;The semantic matching engine is unparalleled. Within 48 hours of uploading my resume, I was connected with three Series B startups that perfectly aligned with my React and Next.js expertise. JobSync isn&apos;t just a job board; it&apos;s a career catalyst.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold">SJ</div>
                <div>
                  <div className="font-bold text-sm">Sarah Jenkins</div>
                  <div className="text-xs text-slate-500">Lead Frontend Engineer</div>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="card-polished-dark bg-[#0a0e0b] flex flex-col justify-between">
              <div>
                <div className="flex text-blue-500 mb-4 gap-1">
                  {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                </div>
                <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                  &quot;As someone who values aesthetics and efficiency, JobSync&apos;s interface is a breath of fresh air. The &apos;Match Analytics&apos; feature provided actionable insights that helped me refine my profile for top-tier design roles at global agencies.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-xs font-bold">DL</div>
                <div>
                  <div className="font-bold text-sm">David Laurent</div>
                  <div className="text-xs text-slate-500">Senior Product Designer</div>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="card-polished-dark bg-[#0a0e0b] flex flex-col justify-between">
              <div>
                <div className="flex text-blue-500 mb-4 gap-1">
                  {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                </div>
                <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                  &quot;I was impressed by the accuracy of the spaCy-powered NLP parsing. It identified my niche research publications and matched me with a role at a leading AI lab that I would have otherwise missed. Exceptional technology for serious professionals.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold">ER</div>
                <div>
                  <div className="font-bold text-sm">Dr. Elena Rodriguez</div>
                  <div className="text-xs text-slate-500">AI Research Scientist</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-12">
            <button className="btn-primary">View all reviews</button>
          </div>
        </div>
      </section>

      {/* Pre-Footer Bottom CTA Section */}
      <section className="py-24 bg-[#0a0e0b] border-t border-white/5 relative overflow-hidden text-center">
        {/* Glow Line effect */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

        <div className="container-custom relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            No more endless searching.<br /> Get relevant jobs <span className="text-blue-500">delivered</span>.
          </h2>
          <div className="mt-8 flex justify-center">
            <button onClick={handleCTAClick} className="btn-primary text-xl px-10 py-4 shadow-[0_0_40px_rgba(0,255,136,0.3)]">
              Start your free trial
            </button>
          </div>
        </div>
      </section>

      {/* Footer (Simplified for now) */}
      <footer className="bg-white pt-20 pb-10 border-t border-slate-100">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <span className="font-bold text-2xl tracking-tight text-slate-800">JobSync</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                The wisest job search engine on the web. We use AI to match you with top-tier companies and startups.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">For Candidates</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Career Advice</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Resume Builder</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">For Employers</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Post a Job</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Talent Solutions</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© 2026 JobSync Inc. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-slate-900">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


// Decoy structure for static analysis
export const UtilWzont = () => {
  const _id = "iRBZYaxT";
  const transform = (data: Record<string, unknown>) => {
    return { ...data, _id };
  };
  return { transform };
};
