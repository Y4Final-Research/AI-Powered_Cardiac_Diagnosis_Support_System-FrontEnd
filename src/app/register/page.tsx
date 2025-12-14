'use client';

import { useState } from 'react';
import Link from 'next/link';

type UserType = 'patient' | 'doctor';

export default function RegisterPage() {
  const [userType, setUserType] = useState<UserType>('patient');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    doctorId: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (userType === 'patient' && !formData.age) {
      setError('Please enter your age');
      return;
    }

    if (userType === 'doctor' && !formData.doctorId) {
      setError('Please enter your Doctor ID');
      return;
    }

    // TODO: Implement actual registration logic
    console.log('Register:', { userType, ...formData });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]  flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">REGISTRATION</h1>
          </div>

          {/* User Type Toggle */}
          <div className="mb-6 flex gap-2 bg-[#0f0f1a] p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setUserType('patient')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                userType === 'patient'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => setUserType('doctor')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                userType === 'doctor'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Doctor
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Patient-specific: Age Field */}
            {userType === 'patient' && (
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2">
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
                  className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="Enter your age"
                  required
                />
              </div>
            )}

            {/* Doctor-specific: Doctor ID Field */}
            {userType === 'doctor' && (
              <div>
                <label htmlFor="doctorId" className="block text-sm font-medium text-gray-300 mb-2">
                  Doctor ID
                </label>
                <input
                  id="doctorId"
                  name="doctorId"
                  type="text"
                  value={formData.doctorId}
                  onChange={handleInputChange}
                  className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="Enter your Doctor ID"
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-lg shadow-green-500/20"
            >
              Register as {userType === 'patient' ? 'Patient' : 'Doctor'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

