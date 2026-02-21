
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
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
              <svg
                className="w-7 h-7 text-cyan-600 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Register</h1>
              <p className="text-xs text-cyan-600/90 font-medium">Create your account</p>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-sm text-slate-600 mb-6">Sign up to access your cardiac diagnostic dashboard</p>

          {/* User Type Toggle */}
          <div className="mb-6 flex gap-2 bg-cyan-50/60 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setUserType('patient')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                userType === 'patient'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-cyan-700 hover:text-cyan-900'
              }`}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => setUserType('doctor')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                userType === 'doctor'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-cyan-700 hover:text-cyan-900'
              }`}
            >
              Doctor
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4 flex gap-3">
                <svg
                  className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4 flex gap-3">
                <svg
                  className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="text-green-700 text-sm font-medium">{success}</p>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
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
                Password
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
                  Age
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
                  Doctor ID
                </label>
                <input
                  id="doctorId"
                  name="doctorId"
                  type="text"
                  value={formData.doctorId}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                  placeholder="Enter your Doctor ID"
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-cyan-500/50 disabled:to-blue-600/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/40 flex items-center justify-center gap-2 transform hover:scale-105 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Registering...</span>
                </>
              ) : (
                <span>Register as {userType === 'patient' ? 'Patient' : 'Doctor'}</span>
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
              Already have an account?{' '}
              <Link href="/login" className="text-cyan-600 hover:text-cyan-700 font-semibold transition-colors">
                Login here
              </Link>
            </p>
          </div>

          {/* Footer info */}
          <div className="mt-6 pt-6 border-t border-slate-300 text-xs text-slate-500 text-center space-y-1">
            <p>Secure AI-Powered Diagnosis</p>
          </div>
        </div>
      </div>
    </div>
  );
}

