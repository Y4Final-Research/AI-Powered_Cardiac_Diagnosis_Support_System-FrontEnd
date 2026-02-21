'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';

interface FormData {
  Age: string;
  Gender: string;
  BMI: string;
  Chol: string;
  TG: string;
  HDL: string;
  LDL: string;
  Cr: string;
  BUN: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

export default function DiabeticPage() {
  const [formData, setFormData] = useState<FormData>({
    Age: '',
    Gender: '',
    BMI: '',
    Chol: '',
    TG: '',
    HDL: '',
    LDL: '',
    Cr: '',
    BUN: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const accessToken = localStorage.getItem('access_token');
        
        if (!userId || !accessToken) {
          setFetchingData(false);
          return;
        }
        
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
        const response = await fetch(`${baseUrl}/api/diabetic/user/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setFormData({
            Age: data.Age?.toString() || '',
            Gender: data.Gender || '',
            BMI: data.BMI?.toString() || '',
            Chol: data.Chol?.toString() || '',
            TG: data.TG?.toString() || '',
            HDL: data.HDL?.toString() || '',
            LDL: data.LDL?.toString() || '',
            Cr: data.Cr?.toString() || '',
            BUN: data.BUN?.toString() || ''
          });
        }
      } catch (error) {
        console.error('Error fetching diabetic data:', error);
      } finally {
        setFetchingData(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.Age || isNaN(Number(formData.Age)) || Number(formData.Age) < 1 || Number(formData.Age) > 120) {
      newErrors.Age = 'Age must be between 1 and 120';
    }
    if (!formData.Gender || (formData.Gender !== 'M' && formData.Gender !== 'F')) {
      newErrors.Gender = 'Gender must be M or F';
    }
    return newErrors;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('https://diabatic-744384162454.asia-south1.run.app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Age: Number(formData.Age),
          Gender: formData.Gender,
          BMI: Number(formData.BMI),
          Chol: Number(formData.Chol),
          TG: Number(formData.TG),
          HDL: Number(formData.HDL),
          LDL: Number(formData.LDL),
          Cr: Number(formData.Cr),
          BUN: Number(formData.BUN)
        })
      });
      
      if (!response.ok) throw new Error(`API request failed`);
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      console.error('Error:', error);
      setResult({ error: `Failed: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };
  
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
          <Link href="/" className="flex items-center gap-2 text-slate-700 hover:text-cyan-600 font-medium transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Diabetic Risk Assessment</h1>
          <p className="text-lg text-slate-600">Analyze metabolic and lab parameters for diabetes risk</p>
        </div>
        
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="Age" className="block text-sm font-semibold text-slate-900 mb-2">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="Age"
                name="Age"
                value={formData.Age}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors ${
                  errors.Age ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'
                }`}
                placeholder="Enter age"
              />
              {errors.Age && <p className="mt-2 text-sm text-red-600 font-medium">{errors.Age}</p>}
            </div>
            
            <div>
              <label htmlFor="Gender" className="block text-sm font-semibold text-slate-900 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                id="Gender"
                name="Gender"
                value={formData.Gender}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors"
              >
                <option value="">Select gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>

            <div>
              <label htmlFor="BMI" className="block text-sm font-semibold text-slate-900 mb-2">
                BMI <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="BMI"
                name="BMI"
                value={formData.BMI}
                onChange={handleChange}
                step="0.1"
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors"
                placeholder="Enter BMI"
              />
            </div>

            <div>
              <label htmlFor="Chol" className="block text-sm font-semibold text-slate-900 mb-2">
                Cholesterol <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="Chol"
                name="Chol"
                value={formData.Chol}
                onChange={handleChange}
                step="0.1"
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors"
                placeholder="Enter value"
              />
            </div>

            <div>
              <label htmlFor="HDL" className="block text-sm font-semibold text-slate-900 mb-2">
                HDL <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="HDL"
                name="HDL"
                value={formData.HDL}
                onChange={handleChange}
                step="0.1"
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors"
                placeholder="Enter value"
              />
            </div>

            <div>
              <label htmlFor="LDL" className="block text-sm font-semibold text-slate-900 mb-2">
                LDL <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="LDL"
                name="LDL"
                value={formData.LDL}
                onChange={handleChange}
                step="0.1"
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors"
                placeholder="Enter value"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading || fetchingData}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-purple-500/50 disabled:to-pink-500/50 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Run Assessment'}
              </button>
            </div>
          </form>
        </div>
        
        {result && (
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Assessment Results</h2>
            <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-6">
              <pre className="text-slate-900 whitespace-pre-wrap break-words font-mono text-sm overflow-auto max-h-96">
                {typeof result === 'object' ? JSON.stringify(result, null, 2) : result}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
