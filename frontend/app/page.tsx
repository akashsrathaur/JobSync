import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
            JobSync
          </div>
          <div className="space-x-4">
            <Link href="/auth/login" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">
              Login
            </Link>
            <Link href="/auth/signup" className="btn-primary">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent leading-tight">
            Find Your Perfect Job with AI
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Upload your resume and let our AI match you with the most relevant job opportunities.
            Get personalized match scores and discover your dream career.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4">
              Start Matching →
            </Link>
            <Link href="#features" className="bg-white hover:bg-slate-50 text-slate-700 font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border border-slate-200">
              Learn More
            </Link>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="glass-card text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">AI-Powered Matching</h3>
            <p className="text-slate-600">
              Advanced algorithms analyze your skills and experience to find the perfect job matches
            </p>
          </div>

          <div className="glass-card text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">Match Scores</h3>
            <p className="text-slate-600">
              See detailed compatibility scores for each job based on your profile and preferences
            </p>
          </div>

          <div className="glass-card text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">Instant Results</h3>
            <p className="text-slate-600">
              Upload your resume and get matched with hundreds of jobs in seconds
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-32">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-800">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Sign Up', desc: 'Create your free account' },
              { step: '2', title: 'Upload Resume', desc: 'AI parses your skills & experience' },
              { step: '3', title: 'Set Preferences', desc: 'Tell us what you\'re looking for' },
              { step: '4', title: 'Get Matched', desc: 'See ranked job opportunities' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                  {item.step}
                </div>
                <h4 className="font-bold text-lg mb-2 text-slate-800">{item.title}</h4>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-32 text-center glass-card max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-slate-800">Ready to Find Your Dream Job?</h2>
          <p className="text-slate-600 mb-6">Join thousands of job seekers using AI to accelerate their career</p>
          <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4 inline-block">
            Get Started Free →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 mt-20 border-t border-slate-200">
        <div className="text-center text-slate-600">
          <p>© 2025 JobSync. AI-Powered Job Matching Platform.</p>
        </div>
      </footer>
    </div>
  );
}
