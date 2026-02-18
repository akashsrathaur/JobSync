'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  MapPin,
  Search,
  Users,
  Zap,
  TrendingUp,
  Target,
  CheckCircle2,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import Logo from './components/Logo';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/auth/signup?search=${searchQuery}&location=${location}`);
  };

  const companies = [
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
    { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
  ];

  const floatingLogos = [
    { name: 'Google', src: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg', top: '15%', left: '10%', delay: '0s' },
    { name: 'Microsoft', src: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', top: '25%', right: '15%', delay: '1s' },
    { name: 'Amazon', src: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg', bottom: '20%', left: '15%', delay: '2s' },
    { name: 'Apple', src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', bottom: '30%', right: '10%', delay: '3s' },
    { name: 'Meta', src: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png', top: '50%', left: '5%', delay: '4s' },
    { name: 'Netflix', src: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', top: '10%', right: '30%', delay: '1.5s' },
  ];

  const trendingJobs = [
    { title: 'Software Engineer', count: '2,500+', icon: <Briefcase className="w-8 h-8 text-indigo-600" /> },
    { title: 'Data Scientist', count: '1,800+', icon: <TrendingUp className="w-8 h-8 text-emerald-600" /> },
    { title: 'Product Manager', count: '1,200+', icon: <Users className="w-8 h-8 text-indigo-600" /> },
    { title: 'UI/UX Designer', count: '900+', icon: <Target className="w-8 h-8 text-pink-600" /> },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="container-custom py-4">
          <nav className="flex justify-between items-center">
            <Logo />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#jobs" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
                Find Jobs
              </a>
              <a href="#companies" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
                Top Companies
              </a>
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
                Why JobSync
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/auth/login"
                className="text-sm font-bold text-slate-700 hover:text-emerald-600 transition-colors px-4 py-2"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-6 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 transition-all border border-emerald-200"
              >
                Go to jobs dashboard
              </Link>
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

      {/* Hero Section with World Map & Floating Logos */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-white">
        {/* World Map Background Pattern */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <img
            src="/world-map.svg"
            alt="World Map"
            className="w-full h-full object-cover object-center translate-y-10"
          />
        </div>

        {/* Floating Company Logos */}
        <div className="absolute inset-0 pointer-events-none z-10 hidden lg:block max-w-7xl mx-auto">
          {floatingLogos.map((logo, index) => (
            <div
              key={index}
              className="absolute bg-white p-3 rounded-xl shadow-lg border border-slate-100 animate-float"
              style={{
                top: logo.top,
                left: logo.left,
                right: logo.right,
                bottom: logo.bottom,
                animationDelay: logo.delay
              }}
            >
              <img src={logo.src} alt={logo.name} className="w-8 h-8 object-contain" />
            </div>
          ))}
        </div>

        <div className="container-custom relative z-20">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-slate-900 leading-[1.1]">
              Apply to <span className="text-emerald-600">Relevant Jobs</span> in <br />
              Seconds with <span className="text-emerald-600">JobSync AI</span>
            </h1>

            <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              Let our Job Copilot search, match and apply - so you don't have to!
            </p>

            {/* Search Bar / CTA */}
            <div className="max-w-md mx-auto">
              <Link
                href="/auth/signup"
                className="block w-full py-4 text-lg font-bold text-white rounded-xl shadow-xl shadow-emerald-500/20 transition-transform hover:-translate-y-1 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300"
              >
                Try JobSync for free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section id="companies" className="py-12 bg-white border-b border-slate-50">
        <div className="container-custom">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by 10,000+ companies worldwide</p>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-duration-500">
            {companies.map((company) => (
              <div key={company.name} className="h-8 flex items-center justify-center w-32">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Jobs */}
      <section id="jobs" className="py-24 bg-gradient-to-b from-emerald-50/50 to-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Trending Opportunities</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Explore the most popular job categories and find your next role.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingJobs.map((job) => (
              <div key={job.title} className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer group">
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors">
                  {job.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{job.title}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-slate-500 text-sm font-medium">{job.count} jobs</p>
                  <ArrowRight className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Why professionals choose <br />
                <span className="text-emerald-500">JobSync</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Our platform uses advanced algorithms to understand your profile deeply, ensuring you only see jobs that truly match your potential.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">AI-Powered Matching</h3>
                    <p className="text-slate-600">Get matched with jobs where you&apos;re most likely to succeed based on skills and culture fit.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Salary Insights</h3>
                    <p className="text-slate-600">Know your worth with real-time salary data.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-indigo-100 rounded-3xl transform rotate-3 -z-10"></div>
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🤖</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Job Copilot</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-emerald-600">Active & Searching</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white shadow-sm`}>
                          {i === 0 ? 'G' : i === 1 ? 'M' : 'A'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">Application Sent</div>
                          <div className="text-xs text-emerald-600 font-medium">Just now</div>
                        </div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                  ))}
                </div>

                <button className="w-full mt-8 py-3 rounded-lg bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors">
                  View Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-20 pb-10 border-t border-slate-100">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <Logo className="mb-6" />
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                The wisest job search engine on the web. We use AI to match you with top-tier companies and startups.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">For Candidates</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Career Advice</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Resume Builder</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">For Employers</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Post a Job</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Talent Solutions</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Contact</a></li>
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
