'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';

interface FormData {
  age: string;
  sex: string;
  cp: string;
  trestbps: string;
  chol: string;
  fbs: string;
  restecg: string;
  thalach: string;
  exang: string;
  oldpeak: string;
  slope: string;
  ca: string;
  thal: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

export default function HeartPage() {
  const [formData, setFormData] = useState<FormData>({
    age: '',
    sex: '',
    cp: '',
    trestbps: '',
    chol: '',
    fbs: '',
    restecg: '',
    thalach: '',
    exang: '',
    oldpeak: '',
    slope: '',
    ca: '',
    thal: ''
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
        const response = await fetch(`${baseUrl}/api/heart/user/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setFormData({
            age: data.age?.toString() || '',
            sex: data.sex?.toString() || '',
            cp: data.cp?.toString() || '',
            trestbps: data.trestbps?.toString() || '',
            chol: data.chol?.toString() || '',
            fbs: data.fbs?.toString() || '',
            restecg: data.restecg?.toString() || '',
            thalach: data.thalach?.toString() || '',
            exang: data.exang?.toString() || '',
            oldpeak: data.oldpeak?.toString() || '',
            slope: data.slope?.toString() || '',
            ca: data.ca?.toString() || '',
            thal: data.thal?.toString() || ''
          });
        }
      } catch (error) {
        console.error('Error fetching heart data:', error);
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
    
    if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) < 1 || Number(formData.age) > 120) {
      newErrors.age = 'Age must be between 1 and 120';
    }
    if (!formData.sex || (formData.sex !== '0' && formData.sex !== '1')) {
      newErrors.sex = 'Sex must be 0 (Female) or 1 (Male)';
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
      const response = await fetch('https://headrtdiseases01-744384162454.asia-south1.run.app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: Number(formData.age),
          sex: Number(formData.sex),
          cp: Number(formData.cp),
          trestbps: Number(formData.trestbps),
          chol: Number(formData.chol),
          fbs: Number(formData.fbs),
          restecg: Number(formData.restecg),
          thalach: Number(formData.thalach),
          exang: Number(formData.exang),
          oldpeak: Number(formData.oldpeak),
          slope: Number(formData.slope),
          ca: Number(formData.ca),
          thal: Number(formData.thal)
        })
      });
      
      if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
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
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Heart Disease Assessment</h1>
          <p className="text-lg text-slate-600">Enter your cardiac health parameters for AI-powered risk assessment</p>
        </div>
        
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="age" className="block text-sm font-semibold text-slate-900 mb-2">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors ${
                  errors.age ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'
                }`}
                placeholder="Enter age"
              />
              {errors.age && <p className="mt-2 text-sm text-red-600 font-medium">{errors.age}</p>}
            </div>
            
            <div>
              <label htmlFor="sex" className="block text-sm font-semibold text-slate-900 mb-2">
                Sex <span className="text-red-500">*</span>
              </label>
              <select
                id="sex"
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors"
              >
                <option value="">Select sex</option>
                <option value="0">Female</option>
                <option value="1">Male</option>
              </select>
            </div>

            <div>
              <label htmlFor="cp" className="block text-sm font-semibold text-slate-900 mb-2">
                Chest Pain Type <span className="text-red-500">*</span>
              </label>
              <select
                id="cp"
                name="cp"
                value={formData.cp}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors"
              >
                <option value="">Select type</option>
                <option value="0">Typical angina</option>
                <option value="1">Atypical angina</option>
                <option value="2">Non-anginal pain</option>
                <option value="3">Asymptomatic</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="trestbps" className="block text-sm font-semibold text-slate-900 mb-2">
                Resting Blood Pressure (mm Hg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="trestbps"
                name="trestbps"
                value={formData.trestbps}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                placeholder="Enter BP"
              />
            </div>
            
            <div>
              <label htmlFor="chol" className="block text-sm font-semibold text-slate-900 mb-2">
                Cholesterol (mg/dl) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="chol"
                name="chol"
                value={formData.chol}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                placeholder="Enter value"
              />
            </div>

            <div>
              <label htmlFor="thalach" className="block text-sm font-semibold text-slate-900 mb-2">
                Max Heart Rate (bpm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="thalach"
                name="thalach"
                value={formData.thalach}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                placeholder="Enter heart rate"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading || fetchingData}
                className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-cyan-500/50 disabled:to-blue-600/50 text-white font-semibold rounded-lg transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
