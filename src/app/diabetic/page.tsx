"use client";
import { useState } from 'react';
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    // Age validation (1-120)
    if (!formData.Age || isNaN(Number(formData.Age)) || Number(formData.Age) < 1 || Number(formData.Age) > 120) {
      newErrors.Age = 'Age must be a number between 1 and 120';
    }
    
    // Gender validation (M or F)
    if (!formData.Gender || (formData.Gender !== 'M' && formData.Gender !== 'F')) {
      newErrors.Gender = 'Gender must be M (Male) or F (Female)';
    }
    
    // BMI validation (10-60)
    if (!formData.BMI || isNaN(Number(formData.BMI)) || Number(formData.BMI) < 10 || Number(formData.BMI) > 60) {
      newErrors.BMI = 'BMI must be between 10 and 60';
    }
    
    // Chol validation (1-20)
    if (!formData.Chol || isNaN(Number(formData.Chol)) || Number(formData.Chol) < 1 || Number(formData.Chol) > 20) {
      newErrors.Chol = 'Cholesterol must be between 1 and 20';
    }
    
    // TG validation (0.1-10)
    if (!formData.TG || isNaN(Number(formData.TG)) || Number(formData.TG) < 0.1 || Number(formData.TG) > 10) {
      newErrors.TG = 'Triglycerides must be between 0.1 and 10';
    }
    
    // HDL validation (0.1-10)
    if (!formData.HDL || isNaN(Number(formData.HDL)) || Number(formData.HDL) < 0.1 || Number(formData.HDL) > 10) {
      newErrors.HDL = 'HDL must be between 0.1 and 10';
    }
    
    // LDL validation (0.1-20)
    if (!formData.LDL || isNaN(Number(formData.LDL)) || Number(formData.LDL) < 0.1 || Number(formData.LDL) > 20) {
      newErrors.LDL = 'LDL must be between 0.1 and 20';
    }
    
    // Cr validation (10-200)
    if (!formData.Cr || isNaN(Number(formData.Cr)) || Number(formData.Cr) < 10 || Number(formData.Cr) > 200) {
      newErrors.Cr = 'Creatinine must be between 10 and 200';
    }
    
    // BUN validation (1-50)
    if (!formData.BUN || isNaN(Number(formData.BUN)) || Number(formData.BUN) < 1 || Number(formData.BUN) > 50) {
      newErrors.BUN = 'BUN must be between 1 and 50';
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
        headers: {
          'Content-Type': 'application/json',
        },
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
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setResult({ error: `Failed to submit form: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Diabetic Test</h1>
          <p className="text-gray-400">Enter patient data for diabetic risk assessment</p>
        </div>
        
        <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="Age" className="block text-sm font-medium text-gray-300 mb-1">
                Age <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="Age"
                name="Age"
                value={formData.Age}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-[#0f0f1a] text-white border rounded-lg ${errors.Age ? 'border-red-500' : 'border-[#2a2a3e]'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter age"
              />
              {errors.Age && <p className="mt-1 text-sm text-red-400">{errors.Age}</p>}
            </div>
            
            <div>
              <label htmlFor="Gender" className="block text-sm font-medium text-gray-300 mb-1">
                Gender <span className="text-red-400">*</span>
              </label>
              <select
                id="Gender"
                name="Gender"
                value={formData.Gender}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-[#0f0f1a] text-white border rounded-lg ${errors.Gender ? 'border-red-500' : 'border-[#2a2a3e]'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select gender</option>
                <option value="M">Male (M)</option>
                <option value="F">Female (F)</option>
              </select>
              {errors.Gender && <p className="mt-1 text-sm text-red-400">{errors.Gender}</p>}
            </div>
            
            <div>
              <label htmlFor="BMI" className="block text-sm font-medium text-white mb-1">
                BMI <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="BMI"
                name="BMI"
                value={formData.BMI}
                onChange={handleChange}
                step="0.1"
                className={`w-full px-4 py-2 bg-[#0f0f1a] text-white border rounded-lg ${errors.BMI ? 'border-red-500' : 'border-[#2a2a3e]'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter BMI"
              />
              {errors.BMI && <p className="mt-1 text-sm text-red-400">{errors.BMI}</p>}
            </div>
            
            <div>
              <label htmlFor="Chol" className="block text-sm font-medium text-gray-300 mb-1">
                Cholesterol <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="Chol"
                name="Chol"
                value={formData.Chol}
                onChange={handleChange}
                step="0.1"
                className={`w-full px-4 py-2 bg-[#0f0f1a] text-white border rounded-lg ${errors.Chol ? 'border-red-500' : 'border-[#2a2a3e]'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter cholesterol level"
              />
              {errors.Chol && <p className="mt-1 text-sm text-red-400">{errors.Chol}</p>}
            </div>
            
            <div>
              <label htmlFor="TG" className="block text-sm font-medium text-gray-300 mb-1">
                Triglycerides (TG) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="TG"
                name="TG"
                value={formData.TG}
                onChange={handleChange}
                step="0.1"
                className={`w-full px-4 py-2 bg-[#0f0f1a] text-white border rounded-lg ${errors.TG ? 'border-red-500' : 'border-[#2a2a3e]'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter triglycerides level"
              />
              {errors.TG && <p className="mt-1 text-sm text-red-400">{errors.TG}</p>}
            </div>
            
            <div>
              <label htmlFor="HDL" className="block text-sm font-medium text-gray-300 mb-1">
                HDL <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="HDL"
                name="HDL"
                value={formData.HDL}
                onChange={handleChange}
                step="0.1"
                className={`w-full px-4 py-2 bg-[#0f0f1a] text-white border rounded-lg ${errors.HDL ? 'border-red-500' : 'border-[#2a2a3e]'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter HDL level"
              />
              {errors.HDL && <p className="mt-1 text-sm text-red-400">{errors.HDL}</p>}
            </div>
            
            <div>
              <label htmlFor="LDL" className="block text-sm font-medium text-gray-300 mb-1">
                LDL <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="LDL"
                name="LDL"
                value={formData.LDL}
                onChange={handleChange}
                step="0.1"
                className={`w-full px-4 py-2 bg-[#0f0f1a] text-white border rounded-lg ${errors.LDL ? 'border-red-500' : 'border-[#2a2a3e]'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter LDL level"
              />
              {errors.LDL && <p className="mt-1 text-sm text-red-400">{errors.LDL}</p>}
            </div>
            
            <div>
              <label htmlFor="Cr" className="block text-sm font-medium text-gray-300 mb-1">
                Creatinine (Cr) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="Cr"
                name="Cr"
                value={formData.Cr}
                onChange={handleChange}
                step="0.1"
                className={`w-full px-4 py-2 bg-[#0f0f1a] text-white border rounded-lg ${errors.Cr ? 'border-red-500' : 'border-[#2a2a3e]'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter creatinine level"
              />
              {errors.Cr && <p className="mt-1 text-sm text-red-400">{errors.Cr}</p>}
            </div>
            
            <div>
              <label htmlFor="BUN" className="block text-sm font-medium text-gray-300 mb-1">
                BUN <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="BUN"
                name="BUN"
                value={formData.BUN}
                onChange={handleChange}
                step="0.1"
                className={`w-full px-4 py-2 bg-[#0f0f1a] text-white border rounded-lg ${errors.BUN ? 'border-red-500' : 'border-[#2a2a3e]'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter BUN level"
              />
              {errors.BUN && <p className="mt-1 text-sm text-red-400">{errors.BUN}</p>}
            </div>
            
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Diabetic Test'}
              </button>
            </div>
          </form>
        </div>
        
        {result && (
          <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Test Results</h2>
            <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg p-4">
              <pre className="text-white whitespace-pre-wrap break-words">
                {typeof result === 'object' ? JSON.stringify(result, null, 2) : result}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
