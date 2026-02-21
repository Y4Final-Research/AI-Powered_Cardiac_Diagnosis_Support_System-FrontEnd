'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Heart, Zap, BarChart3, Brain, LogOut, User, Upload } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const name = localStorage.getItem('name');
    
    if (!accessToken) {
      router.push('/login');
      return;
    }

    setUserName(name || 'User');
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg shadow-cyan-500/30">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-900 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  const assessments = [
    {
      id: 1,
      title: 'Lab Report Upload & Analysis',
      description: 'Upload medical documents and get AI-powered analysis of your lab results',
      icon: Upload,
      href: '/analysis',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">CardiAI</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
              <User className="w-5 h-5 text-slate-700" />
              <span className="text-slate-900 font-medium">{userName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-red-600 font-medium transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Welcome, {userName}!</h1>
        </div>

        {/* Assessment Card Only */}
        <div className="flex justify-center mb-16">
          {assessments.map((assessment) => {
            const Icon = assessment.icon;
            return (
              <Link
                key={assessment.id}
                href={assessment.href}
                className="group w-full max-w-2xl"
              >
                <div
                  className={`relative overflow-hidden bg-gradient-to-br ${assessment.bgColor} border-2 border-slate-200 rounded-3xl p-12 hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer`}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${assessment.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>

                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    {/* Icon */}
                    <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${assessment.color} p-6 mb-6 md:mb-0 shadow-lg shadow-current/20 flex-shrink-0 flex items-center justify-center`}>
                      <Icon className="w-12 h-12 text-white" />
                    </div>

                    <div className="flex-1">
                      {/* Title */}
                      <h2 className="text-3xl font-bold text-slate-900 mb-4">{assessment.title}</h2>

                      {/* Description */}
                      <p className="text-slate-700 mb-8 leading-relaxed text-lg">{assessment.description}</p>

                      {/* CTA */}
                      <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-lg font-semibold hover:shadow-lg transition-all group-hover/btn text-lg">
                        Start Analysis
                        <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Select Assessment</h3>
              <p className="text-slate-600">Choose from our specialized cardiac diagnostic assessments tailored to your health needs</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Enter Your Data</h3>
              <p className="text-slate-600">Input your health metrics and lab results in our secure, user-friendly interface</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Get AI Analysis</h3>
              <p className="text-slate-600">Receive detailed AI-powered diagnostic insights based on clinical guidelines</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 mt-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 CardiAI. All rights reserved. | Advanced Cardiac Diagnostics Powered by AI</p>
        </div>
      </footer>
    </div>
  );
}
