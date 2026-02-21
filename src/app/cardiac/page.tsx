'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';

interface FormData {
  Age: string;
  Gender: string;
  BMI: string;
  BP_Systolic: string;
  BP_Diastolic: string;
  Heart_Rate: string;
  Troponin_T: string;
  CK_MB: string;
  BNP: string;
  Total_Cholesterol: string;
  LDL: string;
  HDL: string;
  Triglycerides: string;
  Fasting_Glucose: string;
  HbA1c: string;
  Creatinine: string;
  BUN: string;
  eGFR: string;
  Sodium: string;
  Potassium: string;
  Calcium: string;
  ALT: string;
  AST: string;
  CRP: string;
  ESR: string;
  Patient_Category: string;
  Cardiac_Risk_Level: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

export default function CardiacPage() {
  const [formData, setFormData] = useState<FormData>({
    Age: '',
    Gender: '',
    BMI: '',
    BP_Systolic: '',
    BP_Diastolic: '',
    Heart_Rate: '',
    Troponin_T: '',
    CK_MB: '',
    BNP: '',
    Total_Cholesterol: '',
    LDL: '',
    HDL: '',
    Triglycerides: '',
    Fasting_Glucose: '',
    HbA1c: '',
    Creatinine: '',
    BUN: '',
    eGFR: '',
    Sodium: '',
    Potassium: '',
    Calcium: '',
    ALT: '',
    AST: '',
    CRP: '',
    ESR: '',
    Patient_Category: '',
    Cardiac_Risk_Level: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
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
    if (!formData.Gender || (formData.Gender !== 'Male' && formData.Gender !== 'Female')) {
      newErrors.Gender = 'Gender is required';
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
      const response = await fetch('https://recommendedtest-744384162454.asia-south1.run.app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Age: Number(formData.Age),
          Gender: formData.Gender,
          BMI: Number(formData.BMI) || 0,
          BP_Systolic: Number(formData.BP_Systolic) || 0,
          BP_Diastolic: Number(formData.BP_Diastolic) || 0,
          Heart_Rate: Number(formData.Heart_Rate) || 0,
          Troponin_T: Number(formData.Troponin_T) || 0,
          CK_MB: Number(formData.CK_MB) || 0,
          BNP: Number(formData.BNP) || 0,
          Total_Cholesterol: Number(formData.Total_Cholesterol) || 0,
          LDL: Number(formData.LDL) || 0,
          HDL: Number(formData.HDL) || 0,
          Triglycerides: Number(formData.Triglycerides) || 0,
          Fasting_Glucose: Number(formData.Fasting_Glucose) || 0,
          HbA1c: Number(formData.HbA1c) || 0,
          Creatinine: Number(formData.Creatinine) || 0,
          BUN: Number(formData.BUN) || 0,
          eGFR: Number(formData.eGFR) || 0,
          Sodium: Number(formData.Sodium) || 0,
          Potassium: Number(formData.Potassium) || 0,
          Calcium: Number(formData.Calcium) || 0,
          ALT: Number(formData.ALT) || 0,
          AST: Number(formData.AST) || 0,
          CRP: Number(formData.CRP) || 0,
          ESR: Number(formData.ESR) || 0,
          Patient_Category: formData.Patient_Category || '',
          Cardiac_Risk_Level: Number(formData.Cardiac_Risk_Level) || 0
        })
      });
      
      if (!response.ok) throw new Error('API request failed');
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Cardiac Risk Assessment</h1>
          <p className="text-lg text-slate-600">Comprehensive cardiac health and lab panel analysis</p>
        </div>
        
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className={`w-full px-4 py-3 border-2 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors ${
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
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.Gender && <p className="mt-2 text-sm text-red-600 font-medium">{errors.Gender}</p>}
            </div>
            
            <div>
              <label htmlFor="BMI" className="block text-sm font-semibold text-slate-900 mb-2">
                BMI
              </label>
              <input
                type="number"
                step="0.1"
                id="BMI"
                name="BMI"
                value={formData.BMI}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors"
                placeholder="Enter BMI"
              />
            </div>

            <div>
              <label htmlFor="BP_Systolic" className="block text-sm font-semibold text-slate-900 mb-2">
                Systolic BP (mm Hg)
              </label>
              <input
                type="number"
                id="BP_Systolic"
                name="BP_Systolic"
                value={formData.BP_Systolic}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors"
                placeholder="Enter value"
              />
            </div>

            <div>
              <label htmlFor="BP_Diastolic" className="block text-sm font-semibold text-slate-900 mb-2">
                Diastolic BP (mm Hg)
              </label>
              <input
                type="number"
                id="BP_Diastolic"
                name="BP_Diastolic"
                value={formData.BP_Diastolic}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors"
                placeholder="Enter value"
              />
            </div>

            <div>
              <label htmlFor="Heart_Rate" className="block text-sm font-semibold text-slate-900 mb-2">
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                id="Heart_Rate"
                name="Heart_Rate"
                value={formData.Heart_Rate}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors"
                placeholder="Enter value"
              />
            </div>

            <div>
              <label htmlFor="Total_Cholesterol" className="block text-sm font-semibold text-slate-900 mb-2">
                Total Cholesterol
              </label>
              <input
                type="number"
                id="Total_Cholesterol"
                name="Total_Cholesterol"
                value={formData.Total_Cholesterol}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors"
                placeholder="Enter value"
              />
            </div>

            <div>
              <label htmlFor="LDL" className="block text-sm font-semibold text-slate-900 mb-2">
                LDL
              </label>
              <input
                type="number"
                id="LDL"
                name="LDL"
                value={formData.LDL}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors"
                placeholder="Enter value"
              />
            </div>

            <div>
              <label htmlFor="HDL" className="block text-sm font-semibold text-slate-900 mb-2">
                HDL
              </label>
              <input
                type="number"
                id="HDL"
                name="HDL"
                value={formData.HDL}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors"
                placeholder="Enter value"
              />
            </div>

            <div className="lg:col-span-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-green-500/50 disabled:to-emerald-600/50 text-white font-semibold rounded-lg transition-all shadow-lg shadow-green-500/30 hover:shadow-green-500/40 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Run Cardiac Assessment'}
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
