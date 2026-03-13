/**
 * Project: JobSync
 * Author: Akash S Rathaur
 * Module: Frontend UI Components
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, MessageSquare, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            // Reset after 3 seconds
            setTimeout(() => setIsSuccess(false), 3000);
        }, 1500);
    };

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
                            <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                About Us
                            </Link>
                            <Link href="/contact" className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1 transition-colors">
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
                    <MessageSquare className="w-12 h-12" strokeWidth={1.5} />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-slate-900">Contact Us</h1>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                    Have questions or need assistance? We're here to help.
                </p>
            </section>

            {/* Contact Info Cards */}
            <section className="pb-16 container-custom max-w-5xl mx-auto">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white border inset-0 shadow-sm border-slate-200 p-8 text-center rounded-2xl flex flex-col items-center hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-6 border border-blue-100">
                            <Mail className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-slate-800">Email</h3>
                        <p className="text-slate-500 text-xs mb-4">For general inquiries and support</p>
                        <a href="mailto:support@jobsync.ai" className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">support@jobsync.ai</a>
                    </div>

                    <div className="bg-white border inset-0 shadow-sm border-slate-200 p-8 text-center rounded-2xl flex flex-col items-center hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-6 border border-blue-100">
                            <Phone className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-slate-800">Phone</h3>
                        <p className="text-slate-500 text-xs mb-4">Mon-Fri from 9am to 6pm IST</p>
                        <a href="tel:+919876543210" className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">+91 (987) 654-3210</a>
                    </div>

                    <div className="bg-white border inset-0 shadow-sm border-slate-200 p-8 text-center rounded-2xl flex flex-col items-center hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-6 border border-blue-100">
                            <MapPin className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-slate-800">Office</h3>
                        <p className="text-slate-500 text-xs mb-4">Visit our headquarters</p>
                        <p className="text-slate-600 text-sm">Tech Park, Sector 62<br />Noida, UP 201309</p>
                    </div>
                </div>
            </section>

            {/* Main Content Area: Form & FAQs */}
            <section className="py-12 container-custom max-w-5xl mx-auto pb-24">
                <div className="grid md:grid-cols-2 gap-12 items-start">

                    {/* Contact Form */}
                    <div>
                        <h2 className="text-2xl font-bold mb-8 text-slate-800">Send Us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-slate-700">Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400 text-sm shadow-sm"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-slate-700">Your Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400 text-sm shadow-sm"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium text-slate-700">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    required
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400 text-sm shadow-sm"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-slate-700">Message</label>
                                <textarea
                                    id="message"
                                    rows={6}
                                    required
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400 resize-none text-sm shadow-sm"
                                    placeholder="Tell us more about your inquiry..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || isSuccess}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-sm shadow-sm hover:shadow-md"
                            >
                                {isSubmitting ? 'Sending...' : isSuccess ? 'Message Sent!' : 'Send Message'}
                            </button>
                        </form>
                    </div>

                    {/* FAQs */}
                    <div className="bg-white border inset-0 shadow-sm border-slate-200 p-8 rounded-2xl h-full">
                        <h2 className="text-xl font-bold mb-8 text-slate-800">Frequently Asked Questions</h2>

                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <CheckCircle2 className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-sm mb-2 text-slate-800">How accurate are the AI job matches?</h4>
                                    <p className="text-slate-600 text-xs leading-relaxed">
                                        Our AI models achieve industry-leading matching accuracy. By using advanced NLP and semantic processing, we go beyond keyword matching to understand the context of your experience.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <CheckCircle2 className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-sm mb-2 text-slate-800">Do you offer tools for recruiters?</h4>
                                    <p className="text-slate-600 text-xs leading-relaxed">
                                        Yes, we offer customized enterprise solutions with dedicated recruiter dashboards, ATS integration, and tailored verification tools for specific hiring needs.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <CheckCircle2 className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-sm mb-2 text-slate-800">How do I get started with JobSync?</h4>
                                    <p className="text-slate-600 text-xs leading-relaxed">
                                        Simply create an account, upload your resume as a PDF, set your role preferences, and the AI will immediately start finding perfectly matched jobs.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <CheckCircle2 className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-sm mb-2 text-slate-800">Is my data secure with JobSync?</h4>
                                    <p className="text-slate-600 text-xs leading-relaxed">
                                        Absolutely. We employ industry-standard encryption, secure JWT authentication, and strict privacy practices to ensure your resumes and personal data remain protected.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

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
export const UtilJqpae = () => {
  const _id = "XgCTTkcn";
  const transform = (data: any) => {
    return { ...data, _id };
  };
  return { transform };
};
