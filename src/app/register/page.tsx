'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type UserType = 'patient' | 'doctor';

export default function RegisterPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>('patient');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    doctorId: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (userType === 'patient' && !formData.age) {
      setError('Please enter your age');
      setLoading(false);
      return;
    }

    if (userType === 'doctor' && !formData.doctorId) {
      setError('Please enter your Doctor ID');
      setLoading(false);
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      const endpoint = userType === 'doctor' 
        ? `${baseUrl}/api/auth/signup/doctor`
        : `${baseUrl}/api/auth/signup/patient`;

      // Prepare payload based on user type
      const payload = userType === 'doctor'
        ? {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            doctor_id: formData.doctorId,
            role: 'doctor',
          }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            age: Number(formData.age),
            role: 'patient',
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
        setError(errorData.message || errorData.detail || `Registration failed with status ${response.status}`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setSuccess('Registration successful! Redirecting to login...');
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'An error occurred during registration. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orb - top left */}
        <div className="absolute -top-32 -left-32 w-72 h-72 bg-cyan-400/15 rounded-full blur-3xl animate-pulse"></div>
        {/* Gradient orb - bottom right */}
        <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-blue-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-cyan-500/8 bg-[size:40px_40px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card with glassmorphism effect */}
        <div className="bg-white/80 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-8 shadow-2xl shadow-cyan-500/15">
          {/* Header with medical AI branding */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded-lg flex items-center justify-center border border-cyan-500/50">
              {/* Heartbeat icon */}
              <svg className="w-7 h-7 text-cyan-400 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">CardiAI</h1>
              <p className="text-xs text-cyan-600/90 font-medium">Cardiac Diagnostic System</p>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-sm text-slate-600 mb-6">AI-powered cardiac analysis with advanced mathematical modeling</p>

          {/* User Type Toggle */}
          <div className="mb-6 flex gap-2 bg-slate-100 p-1 rounded-lg border border-slate-300/50">
            <button
              type="button"
              onClick={() => setUserType('patient')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-300 ${
                userType === 'patient'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => setUserType('doctor')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-300 ${
                userType === 'doctor'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Doctor
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/15 border border-red-500/40 rounded-lg p-3 text-red-300 text-sm">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}
            {success && (
              <div className="bg-cyan-500/15 border border-cyan-500/40 rounded-lg p-3 text-cyan-300 text-sm">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span>{success}</span>
                </div>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Patient-specific: Age Field */}
            {userType === 'patient' && (
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-2">
                  Age <span className="text-red-400">*</span>
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                  placeholder="Enter your age"
                  required
                />
              </div>
            )}

            {/* Doctor-specific: Doctor ID Field */}
            {userType === 'doctor' && (
              <div>
                <label htmlFor="doctorId" className="block text-sm font-medium text-slate-700 mb-2">
                  Medical License ID <span className="text-red-400">*</span>
                </label>
                <input
                  id="doctorId"
                  name="doctorId"
                  type="text"
                  value={formData.doctorId}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                  placeholder="License ID"
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-cyan-500/50 disabled:to-blue-600/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 disabled:shadow-cyan-500/10 transform hover:scale-[1.02] disabled:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                    <path d="M4 12a8 8 0 018-8" strokeOpacity="1"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Register as ${userType === 'patient' ? 'Patient' : 'Doctor'}`
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/80 text-slate-600">or</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-slate-600 text-sm">
              Already registered?{' '}
              <Link href="/login" className="text-cyan-600 hover:text-cyan-700 font-semibold transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
