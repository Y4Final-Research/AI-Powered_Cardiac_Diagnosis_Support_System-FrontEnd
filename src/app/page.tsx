'use client';

import Link from 'next/link';
import { ArrowRight, Heart, Zap, Brain, BarChart3, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const services = [
    {
      id: 1,
      title: 'Noise-Robust ECG Digitization',
      description: 'Advanced noise filtering and ECG signal processing for accurate cardiac waveform digitization from any source.',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300/50',
      features: ['Real-time processing', 'Noise filtering', 'Signal normalization'],
    },
    {
      id: 2,
      title: 'Category-Aware Lab Recommendation',
      description: 'AI-powered lab test recommendations based on patient medical history and clinical guidelines.',
      icon: BarChart3,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-300/50',
      features: ['Smart recommendations', 'Cost optimization', 'Guideline compliance'],
      href: '/lab-report',
    },
    {
      id: 3,
      title: 'Sinhala Clinical Conversation Analysis',
      description: 'Natural language processing for Sinhala medical conversations with clinical entity extraction.',
      icon: Brain,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-300/50',
      href: '/clinical-conversation',
      features: ['Language support', 'Entity extraction', 'Clinical insights'],
    },
    {
      id: 4,
      title: 'Evidence-Driven Reasoning Agents (KRA & ORA)',
      description: 'Knowledge and observation reasoning agents that provide evidence-based diagnostic conclusions.',
      icon: Brain,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300/50',
      features: ['Knowledge reasoning', 'Evidence synthesis', 'Diagnostic logic'],
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

          <div className="hidden md:flex items-center gap-8">
            <Link href="#services" className="text-slate-700 hover:text-cyan-600 font-medium transition-colors">
              Services
            </Link>
            <Link href="#features" className="text-slate-700 hover:text-cyan-600 font-medium transition-colors">
              Features
            </Link>
            <Link href="/login" className="text-slate-700 hover:text-cyan-600 font-medium transition-colors">
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 text-balance">
              Advanced <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Cardiac Diagnostics</span> Powered by AI
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 text-balance max-w-3xl mx-auto">
              Transform cardiac care with our comprehensive AI diagnostic platform combining ECG analysis, lab recommendations, and clinical reasoning.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-cyan-500/30 transition-all flex items-center gap-2 group"
            >
              Start Diagnosis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#services"
              className="px-8 py-4 border-2 border-slate-300 text-slate-900 rounded-xl font-semibold hover:border-cyan-500 hover:bg-cyan-50 transition-all"
            >
              Explore Services
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
            {[
              { label: 'AI Models', value: '4' },
              { label: 'Accuracy', value: '95%+' },
              { label: 'Languages', value: '5+' },
              { label: 'Tests', value: '100+' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl font-bold text-cyan-600">{stat.value}</p>
                <p className="text-sm text-slate-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Four Core Diagnostic Services</h2>
          <p className="text-lg text-slate-600">Comprehensive AI-powered tools for modern cardiac care</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            const [color1, color2] = service.color.split(' to-');
            const CardContent = (
              <div
                className={`group relative overflow-hidden bg-gradient-to-br ${service.bgColor} border-2 ${service.borderColor} rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-2`}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} p-3 mb-4 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.title}</h3>

                  {/* Description */}
                  <p className="text-slate-700 mb-6 leading-relaxed">{service.description}</p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-700">
                        <CheckCircle className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    href={service.href || '/dashboard'}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all group/btn"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
            return service.href ? (
              <Link key={service.id} href={service.href} className="block focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-2xl">
                {CardContent}
              </Link>
            ) : (
              <div key={service.id}>{CardContent}</div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-12 md:p-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-12 text-center">Why Choose CardiAI?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'AI-Powered Accuracy',
                description: 'Advanced machine learning models trained on thousands of cardiac cases for reliable diagnostics.',
                icon: '🧠',
              },
              {
                title: 'Multi-Modal Analysis',
                description: 'Comprehensive analysis combining ECG data, lab results, and clinical conversations.',
                icon: '📊',
              },
              {
                title: 'Clinical Integration',
                description: 'Seamless integration with existing medical workflows and electronic health records.',
                icon: '🔗',
              },
              {
                title: 'Evidence-Based Reasoning',
                description: 'Transparent decision-making backed by medical literature and clinical guidelines.',
                icon: '📚',
              },
              {
                title: 'Multilingual Support',
                description: 'Support for multiple languages including Sinhala for broader accessibility.',
                icon: '🌍',
              },
              {
                title: '24/7 Availability',
                description: 'Always-on diagnostic support for continuous patient monitoring and analysis.',
                icon: '⏰',
              },
            ].map((feature, idx) => (
              <div key={idx} className="space-y-3">
                <p className="text-4xl">{feature.icon}</p>
                <h4 className="text-xl font-bold text-slate-900">{feature.title}</h4>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-12 md:p-16 text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-balance">
              Ready to Transform Cardiac Care?
            </h2>
            <p className="text-lg text-cyan-100 max-w-2xl mx-auto">
              Join healthcare professionals using CardiAI for advanced cardiac diagnostics and evidence-based patient care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-white text-cyan-600 rounded-xl font-bold hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 group"
              >
                Create Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">CardiAI</span>
              </div>
              <p className="text-sm">Advanced cardiac diagnostics powered by artificial intelligence.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#services" className="hover:text-cyan-400 transition-colors">
                    ECG Digitization
                  </Link>
                </li>
                <li>
                  <Link href="#services" className="hover:text-cyan-400 transition-colors">
                    Lab Recommendations
                  </Link>
                </li>
                <li>
                  <Link href="#services" className="hover:text-cyan-400 transition-colors">
                    Clinical Analysis
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors">
                    HIPAA Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2024 CardiAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
