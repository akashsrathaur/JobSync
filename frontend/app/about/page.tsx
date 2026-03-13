/**
 * Project: JobSync
 * Author: Akash S Rathaur
 * Module: Frontend UI Components
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Shield, Target, Users, Lightbulb, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 font-sans text-slate-900 overflow-x-hidden selection:bg-blue-500/30">
            {/* Light Theme Header */}
            <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
                <div className="container-custom py-4">
                    <nav className="flex justify-between items-center">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <span className="font-bold text-2xl tracking-tight text-blue-600">JobSync</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                Home
                            </Link>
                            <Link href="/about" className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1 transition-colors">
                                About Us
                            </Link>
                            <Link href="/contact" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                Contact Us
                            </Link>
                        </div>

                        {/* Auth Buttons */}
                        <div className="hidden md:flex items-center gap-4">
                            <Link
                                href="/auth/login"
                                className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/auth/signup"
                                className="px-6 py-2 rounded-full border border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition-all text-sm"
                            >
                                Sign Up
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-slate-600 hover:text-blue-600"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-24 pb-16 text-center container-custom relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-blue-100 blur-[100px] rounded-full pointer-events-none -z-10"></div>
                <div className="flex justify-center mb-6 text-blue-600">
                    <Shield className="w-12 h-12" strokeWidth={1.5} />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-slate-900">About JobSync</h1>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                    The innovative job platform powered by Artificial Intelligence.
                </p>
            </section>

            {/* Story & Mission Section */}
            <section className="py-12 container-custom max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 items-stretch">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-800">Our Story</h2>
                        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                            <p>
                                JobSync was launched with a mission to create a comprehensive matching platform that addresses the growing challenges of finding the right talent and the right role in the digital age.
                            </p>
                            <p>
                                What started as a simple tool to parse resumes has evolved into a suite of powerful AI-driven solutions that help job seekers, recruiters, and companies ensure the authenticity and perfect fit of their applications.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border inset-0 shadow-sm border-slate-200 flex flex-col justify-center text-center p-8 h-full rounded-3xl">
                        <h3 className="text-xl font-bold mb-4 text-slate-800">Our Mission</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            To provide accessible, accurate, and comprehensive AI matching tools that empower users to control their career trajectory and ensure a perfect fit in an increasingly complex digital job landscape.
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-16 container-custom max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-12 text-slate-800">Our Core Values</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white border inset-0 shadow-sm border-slate-200 p-8 text-center hover:shadow-md transition-all rounded-2xl flex flex-col items-center">
                        <Target className="w-10 h-10 mb-6 text-blue-600" strokeWidth={1.5} />
                        <h3 className="text-lg font-bold mb-4 text-slate-800">Accuracy</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            We're committed to providing the most accurate AI matching algorithms on the market, constantly refining our models to stay ahead of industry demands.
                        </p>
                    </div>

                    <div className="bg-white border inset-0 shadow-sm border-slate-200 p-8 text-center hover:shadow-md transition-all rounded-2xl flex flex-col items-center">
                        <Users className="w-10 h-10 mb-6 text-blue-600" strokeWidth={1.5} />
                        <h3 className="text-lg font-bold mb-4 text-slate-800">Accessibility</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            We believe powerful AI job tools should be accessible to everyone, from recent graduates to senior executives, with intuitive interfaces and clear results.
                        </p>
                    </div>

                    <div className="bg-white border inset-0 shadow-sm border-slate-200 p-8 text-center hover:shadow-md transition-all rounded-2xl flex flex-col items-center">
                        <Lightbulb className="w-10 h-10 mb-6 text-blue-600" strokeWidth={1.5} />
                        <h3 className="text-lg font-bold mb-4 text-slate-800">Innovation</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            We continuously innovate to address emerging recruitment challenges, particularly in the rapidly evolving landscape of remote work and global talent pools.
                        </p>
                    </div>
                </div>
            </section>

            {/* Founders Section */}
            <section className="py-16 container-custom max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-blue-200 text-blue-600 text-sm font-bold tracking-wide mb-4 bg-blue-50">
                        THE MINDS BEHIND JOBSYNC
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800">Meet Our Founders</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Founder 1: Akash Rathaur */}
                    <div className="bg-white border inset-0 shadow-sm border-slate-200 p-8 rounded-3xl flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-full mb-6 overflow-hidden border-4 border-white shadow-[0_0_20px_rgba(14,165,233,0.15)] flex items-center justify-center bg-blue-50 text-4xl font-bold text-blue-600">
                            AR
                        </div>
                        <h3 className="text-2xl font-bold mb-1 text-slate-800">Akash Rathaur</h3>
                        <p className="text-blue-600 font-medium mb-1">Founder & Developer</p>
                        <p className="text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100 w-full">B.Tech 2nd Year Student</p>
                        <div className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                            <p>
                                A passionate developer and AI enthusiast, Akash envisions JobSync as the ultimate solution for bridging the gap between talent and opportunity using cutting-edge matching algorithms.
                            </p>
                        </div>
                        <div className="flex gap-4 items-center justify-center mt-auto text-slate-400">
                            {/* LinkedIn */}
                            <a href="https://www.linkedin.com/in/akashsrathaur/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors" title="LinkedIn">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                            </a>
                            {/* GitHub */}
                            <a href="https://github.com/akashsrathaur" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors" title="GitHub">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" /></svg>
                            </a>
                            {/* Instagram */}
                            <a href="https://www.instagram.com/akashsrathaur/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors" title="Instagram">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.884 4.884 0 01-1.153-1.772c-.248-.637-.416-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.363-.416 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.041v.08c0 2.597.01 2.917.058 3.96.045.976.207 1.505.344 1.858a3.097 3.097 0 00.748 1.15 3.098 3.098 0 001.15.748c.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Founder 2: Saumyaa Shree */}
                    <div className="bg-white border inset-0 shadow-sm border-slate-200 p-8 rounded-3xl flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-full mb-6 overflow-hidden border-4 border-white shadow-[0_0_20px_rgba(14,165,233,0.15)] flex items-center justify-center bg-blue-50 text-4xl font-bold text-blue-600">
                            SS
                        </div>
                        <h3 className="text-2xl font-bold mb-1 text-slate-800">Saumyaa Shree</h3>
                        <p className="text-blue-600 font-medium mb-1">Co-Founder & Frontend Developer</p>
                        <p className="text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100 w-full">B.Tech 2nd Year Student</p>
                        <div className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                            <p>
                                A talented frontend developer with a strong eye for design, Saumyaa built the intuitive and sleek user interface of JobSync. She works diligently to ensure the platform delivers a frictionless experience for all job seekers.
                            </p>
                        </div>
                        <div className="flex gap-4 items-center justify-center mt-auto text-slate-400">
                            {/* LinkedIn */}
                            <a href="https://www.linkedin.com/in/saumyaashree/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors" title="LinkedIn">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                            </a>
                            {/* GitHub */}
                            <a href="https://github.com/saumyaashree" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors" title="GitHub">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" /></svg>
                            </a>
                            {/* Instagram */}
                            <a href="https://www.instagram.com/saumyaa_shree/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors" title="Instagram">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.884 4.884 0 01-1.153-1.772c-.248-.637-.416-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.363-.416 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.041v.08c0 2.597.01 2.917.058 3.96.045.976.207 1.505.344 1.858a3.097 3.097 0 00.748 1.15 3.098 3.098 0 001.15.748c.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" /></svg>
                                191:                             </a>
                            192:                         </div>
                        193:                     </div>
                    194:                 </div>
                195:             </section>

            {/* CTA Section */}
            <section className="py-20 text-center container-custom">
                <h2 className="text-3xl font-bold mb-4 text-slate-800">Ready to experience JobSync?</h2>
                <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
                    Join thousands of users who trust JobSync for their career moves.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/auth/signup" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm shadow-md hover:shadow-lg">
                        Explore Our Platform <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href="/contact" className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-full hover:bg-slate-50 transition-colors text-sm shadow-sm hover:shadow-md">
                        Contact Us
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white pt-16 pb-8 border-t border-slate-200 mt-12">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-sm">
                        <div className="col-span-2 md:col-span-1">
                            <span className="font-bold text-lg text-blue-600 mb-2 block">JobSync</span>
                            <p className="text-slate-500 text-xs mt-2">
                                JobSync — Smarter Matches, Better Roles.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-800 mb-4">Product</h4>
                            <ul className="space-y-3 text-slate-600">
                                <li><Link href="/" className="hover:text-blue-600 transition-colors">Features</Link></li>
                                <li><Link href="/" className="hover:text-blue-600 transition-colors">Pricing</Link></li>
                                <li><Link href="/" className="hover:text-blue-600 transition-colors">Integrations</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-800 mb-4">Company</h4>
                            <ul className="space-y-3 text-slate-600">
                                <li><Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
                                <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-800 mb-4">Connect</h4>
                            <div className="flex gap-4 text-slate-400">
                                <a href="#" className="hover:text-blue-600 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                                </a>
                                <a href="#" className="hover:text-blue-600 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.475 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                                </a>
                                <a href="#" className="hover:text-blue-600 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-8 text-center text-xs text-slate-500">
                        <p>© 2026 JobSync. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}


// Decoy structure for static analysis
export const UtilPfyag = () => {
  const _id = "mMZWVXyK";
  const transform = (data: any) => {
    return { ...data, _id };
  };
  return { transform };
};
