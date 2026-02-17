"use client";
import { useState, useEffect } from 'react';
import Header from "@/components/header";
import SideNavigation from "@/components/side-navigation";

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

  // Auth state for header
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | undefined>("User");

  useEffect(() => {
    // Check login state and user name from localStorage
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
    const name = localStorage.getItem("user_name");
    if (name) setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    setIsLoggedIn(false);
    // Optionally redirect or reload
  };

  const handleLogin = () => {
    // Implement login logic or redirect to login page
  };

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
    
    // Age validation
    if (!formData.Age || isNaN(Number(formData.Age)) || Number(formData.Age) < 1 || Number(formData.Age) > 120) {
      newErrors.Age = 'Age must be a number between 1 and 120';
    }
    
    // Gender validation
    if (!formData.Gender || (formData.Gender !== 'Male' && formData.Gender !== 'Female')) {
      newErrors.Gender = 'Gender must be Male or Female';
    }
    
    // BMI validation
    if (!formData.BMI || isNaN(Number(formData.BMI)) || Number(formData.BMI) < 10 || Number(formData.BMI) > 50) {
      newErrors.BMI = 'BMI must be a number between 10 and 50';
    }
    
    // BP_Systolic validation
    if (!formData.BP_Systolic || isNaN(Number(formData.BP_Systolic)) || Number(formData.BP_Systolic) < 50 || Number(formData.BP_Systolic) > 250) {
      newErrors.BP_Systolic = 'Systolic BP must be between 50 and 250';
    }
    
    // BP_Diastolic validation
    if (!formData.BP_Diastolic || isNaN(Number(formData.BP_Diastolic)) || Number(formData.BP_Diastolic) < 30 || Number(formData.BP_Diastolic) > 150) {
      newErrors.BP_Diastolic = 'Diastolic BP must be between 30 and 150';
    }
    
    // Heart_Rate validation
    if (!formData.Heart_Rate || isNaN(Number(formData.Heart_Rate)) || Number(formData.Heart_Rate) < 30 || Number(formData.Heart_Rate) > 200) {
      newErrors.Heart_Rate = 'Heart rate must be between 30 and 200';
    }
    
    // Numeric validations for lab values
    const numericFields = [
      'Troponin_T', 'CK_MB', 'BNP', 'Total_Cholesterol', 'LDL', 'HDL', 'Triglycerides',
      'Fasting_Glucose', 'HbA1c', 'Creatinine', 'BUN', 'eGFR', 'Sodium', 'Potassium',
      'Calcium', 'ALT', 'AST', 'CRP', 'ESR'
    ];
    
    numericFields.forEach(field => {
      if (!formData[field as keyof FormData] || isNaN(Number(formData[field as keyof FormData]))) {
        newErrors[field] = `${field.replace(/_/g, ' ')} must be a valid number`;
      }
    });
    
    // Patient_Category validation
    if (!formData.Patient_Category) {
      newErrors.Patient_Category = 'Patient category is required';
    }
    
    // Cardiac_Risk_Level validation
    if (!formData.Cardiac_Risk_Level || isNaN(Number(formData.Cardiac_Risk_Level)) || Number(formData.Cardiac_Risk_Level) < 0 || Number(formData.Cardiac_Risk_Level) > 5) {
      newErrors.Cardiac_Risk_Level = 'Cardiac risk level must be between 0 and 5';
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Age: Number(formData.Age),
          Gender: formData.Gender,
          BMI: Number(formData.BMI),
          BP_Systolic: Number(formData.BP_Systolic),
          BP_Diastolic: Number(formData.BP_Diastolic),
          Heart_Rate: Number(formData.Heart_Rate),
          Troponin_T: Number(formData.Troponin_T),
          CK_MB: Number(formData.CK_MB),
          BNP: Number(formData.BNP),
          Total_Cholesterol: Number(formData.Total_Cholesterol),
          LDL: Number(formData.LDL),
          HDL: Number(formData.HDL),
          Triglycerides: Number(formData.Triglycerides),
          Fasting_Glucose: Number(formData.Fasting_Glucose),
          HbA1c: Number(formData.HbA1c),
          Creatinine: Number(formData.Creatinine),
          BUN: Number(formData.BUN),
          eGFR: Number(formData.eGFR),
          Sodium: Number(formData.Sodium),
          Potassium: Number(formData.Potassium),
          Calcium: Number(formData.Calcium),
          ALT: Number(formData.ALT),
          AST: Number(formData.AST),
          CRP: Number(formData.CRP),
          ESR: Number(formData.ESR),
          Patient_Category: formData.Patient_Category,
          Cardiac_Risk_Level: Number(formData.Cardiac_Risk_Level)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Header
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogout={handleLogout}
        onLogin={handleLogin}
      />
      <div className="flex">
        <SideNavigation />
        <main className="flex-1 lg:ml-64 pt-6 pb-20 px-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white border border-cyan-400/20 rounded-xl p-8 shadow-md">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Cardiac Test</h1>
                <p className="text-slate-600">Enter patient data for cardiac risk assessment</p>
              </div>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Basic Information */}
                <div>
                  <label htmlFor="Age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="Age"
                    name="Age"
                    value={formData.Age}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.Age ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter age"
                  />
                  {errors.Age && <p className="mt-1 text-sm text-red-400">{errors.Age}</p>}
                </div>
                
                <div>
                  <label htmlFor="Gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="Gender"
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.Gender ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.Gender && <p className="mt-1 text-sm text-red-400">{errors.Gender}</p>}
                </div>
                
                <div>
                  <label htmlFor="BMI" className="block text-sm font-medium text-gray-700 mb-1">
                    BMI <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="BMI"
                    name="BMI"
                    value={formData.BMI}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.BMI ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter BMI"
                  />
                  {errors.BMI && <p className="mt-1 text-sm text-red-400">{errors.BMI}</p>}
                </div>
                
                {/* Blood Pressure */}
                <div>
                  <label htmlFor="BP_Systolic" className="block text-sm font-medium text-gray-700 mb-1">
                    BP Systolic (mm Hg) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="BP_Systolic"
                    name="BP_Systolic"
                    value={formData.BP_Systolic}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.BP_Systolic ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter systolic BP"
                  />
                  {errors.BP_Systolic && <p className="mt-1 text-sm text-red-400">{errors.BP_Systolic}</p>}
                </div>
                
                <div>
                  <label htmlFor="BP_Diastolic" className="block text-sm font-medium text-gray-700 mb-1">
                    BP Diastolic (mm Hg) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="BP_Diastolic"
                    name="BP_Diastolic"
                    value={formData.BP_Diastolic}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.BP_Diastolic ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter diastolic BP"
                  />
                  {errors.BP_Diastolic && <p className="mt-1 text-sm text-red-400">{errors.BP_Diastolic}</p>}
                </div>
                
                <div>
                  <label htmlFor="Heart_Rate" className="block text-sm font-medium text-gray-700 mb-1">
                    Heart Rate (bpm) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="Heart_Rate"
                    name="Heart_Rate"
                    value={formData.Heart_Rate}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.Heart_Rate ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter heart rate"
                  />
                  {errors.Heart_Rate && <p className="mt-1 text-sm text-red-400">{errors.Heart_Rate}</p>}
                </div>
                
                {/* Cardiac Markers */}
                <div>
                  <label htmlFor="Troponin_T" className="block text-sm font-medium text-gray-700 mb-1">
                    Troponin T (ng/ml) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="Troponin_T"
                    name="Troponin_T"
                    value={formData.Troponin_T}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.Troponin_T ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter Troponin T"
                  />
                  {errors.Troponin_T && <p className="mt-1 text-sm text-red-400">{errors.Troponin_T}</p>}
                </div>
                
                <div>
                  <label htmlFor="CK_MB" className="block text-sm font-medium text-gray-700 mb-1">
                    CK-MB (ng/ml) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="CK_MB"
                    name="CK_MB"
                    value={formData.CK_MB}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.CK_MB ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter CK-MB"
                  />
                  {errors.CK_MB && <p className="mt-1 text-sm text-red-400">{errors.CK_MB}</p>}
                </div>
                
                <div>
                  <label htmlFor="BNP" className="block text-sm font-medium text-gray-700 mb-1">
                    BNP (pg/ml) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="BNP"
                    name="BNP"
                    value={formData.BNP}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.BNP ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter BNP"
                  />
                  {errors.BNP && <p className="mt-1 text-sm text-red-400">{errors.BNP}</p>}
                </div>
                
                {/* Lipid Profile */}
                <div>
                  <label htmlFor="Total_Cholesterol" className="block text-sm font-medium text-gray-700 mb-1">
                    Total Cholesterol (mg/dl) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="Total_Cholesterol"
                    name="Total_Cholesterol"
                    value={formData.Total_Cholesterol}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.Total_Cholesterol ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter total cholesterol"
                  />
                  {errors.Total_Cholesterol && <p className="mt-1 text-sm text-red-400">{errors.Total_Cholesterol}</p>}
                </div>
                
                <div>
                  <label htmlFor="LDL" className="block text-sm font-medium text-gray-700 mb-1">
                    LDL (mg/dl) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="LDL"
                    name="LDL"
                    value={formData.LDL}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.LDL ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter LDL"
                  />
                  {errors.LDL && <p className="mt-1 text-sm text-red-400">{errors.LDL}</p>}
                </div>
                
                <div>
                  <label htmlFor="HDL" className="block text-sm font-medium text-gray-700 mb-1">
                    HDL (mg/dl) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="HDL"
                    name="HDL"
                    value={formData.HDL}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.HDL ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter HDL"
                  />
                  {errors.HDL && <p className="mt-1 text-sm text-red-400">{errors.HDL}</p>}
                </div>
                
                <div>
                  <label htmlFor="Triglycerides" className="block text-sm font-medium text-gray-700 mb-1">
                    Triglycerides (mg/dl) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="Triglycerides"
                    name="Triglycerides"
                    value={formData.Triglycerides}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.Triglycerides ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter triglycerides"
                  />
                  {errors.Triglycerides && <p className="mt-1 text-sm text-red-400">{errors.Triglycerides}</p>}
                </div>
                
                {/* Glucose */}
                <div>
                  <label htmlFor="Fasting_Glucose" className="block text-sm font-medium text-gray-700 mb-1">
                    Fasting Glucose (mg/dl) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="Fasting_Glucose"
                    name="Fasting_Glucose"
                    value={formData.Fasting_Glucose}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.Fasting_Glucose ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter fasting glucose"
                  />
                  {errors.Fasting_Glucose && <p className="mt-1 text-sm text-red-400">{errors.Fasting_Glucose}</p>}
                </div>
                
                <div>
                  <label htmlFor="HbA1c" className="block text-sm font-medium text-gray-700 mb-1">
                    HbA1c (%) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="HbA1c"
                    name="HbA1c"
                    value={formData.HbA1c}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.HbA1c ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter HbA1c"
                  />
                  {errors.HbA1c && <p className="mt-1 text-sm text-red-400">{errors.HbA1c}</p>}
                </div>
                
                {/* Renal Function */}
                <div>
                  <label htmlFor="Creatinine" className="block text-sm font-medium text-gray-700 mb-1">
                    Creatinine (mg/dl) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="Creatinine"
                    name="Creatinine"
                    value={formData.Creatinine}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.Creatinine ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter creatinine"
                  />
                  {errors.Creatinine && <p className="mt-1 text-sm text-red-400">{errors.Creatinine}</p>}
                </div>
                
                <div>
                  <label htmlFor="BUN" className="block text-sm font-medium text-gray-700 mb-1">
                    BUN (mg/dl) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="BUN"
                    name="BUN"
                    value={formData.BUN}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.BUN ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter BUN"
                  />
                  {errors.BUN && <p className="mt-1 text-sm text-red-400">{errors.BUN}</p>}
                </div>
                
                <div>
                  <label htmlFor="eGFR" className="block text-sm font-medium text-gray-700 mb-1">
                    eGFR (ml/min/1.73m²) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="eGFR"
                    name="eGFR"
                    value={formData.eGFR}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.eGFR ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter eGFR"
                  />
                  {errors.eGFR && <p className="mt-1 text-sm text-red-400">{errors.eGFR}</p>}
                </div>
                
                {/* Electrolytes */}
                <div>
                  <label htmlFor="Sodium" className="block text-sm font-medium text-gray-700 mb-1">
                    Sodium (mEq/L) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="Sodium"
                    name="Sodium"
                    value={formData.Sodium}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.Sodium ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter sodium"
                  />
                  {errors.Sodium && <p className="mt-1 text-sm text-red-400">{errors.Sodium}</p>}
                </div>
                
                <div>
                  <label htmlFor="Potassium" className="block text-sm font-medium text-gray-700 mb-1">
                    Potassium (mEq/L) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="Potassium"
                    name="Potassium"
                    value={formData.Potassium}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.Potassium ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter potassium"
                  />
                  {errors.Potassium && <p className="mt-1 text-sm text-red-400">{errors.Potassium}</p>}
                </div>
                
                <div>
                  <label htmlFor="Calcium" className="block text-sm font-medium text-gray-700 mb-1">
                    Calcium (mg/dl) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="Calcium"
                    name="Calcium"
                    value={formData.Calcium}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.Calcium ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter calcium"
                  />
                  {errors.Calcium && <p className="mt-1 text-sm text-red-400">{errors.Calcium}</p>}
                </div>
                
                {/* Liver Function */}
                <div>
                  <label htmlFor="ALT" className="block text-sm font-medium text-gray-700 mb-1">
                    ALT (U/L) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="ALT"
                    name="ALT"
                    value={formData.ALT}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.ALT ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter ALT"
                  />
                  {errors.ALT && <p className="mt-1 text-sm text-red-400">{errors.ALT}</p>}
                </div>
                
                <div>
                  <label htmlFor="AST" className="block text-sm font-medium text-gray-700 mb-1">
                    AST (U/L) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="AST"
                    name="AST"
                    value={formData.AST}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.AST ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter AST"
                  />
                  {errors.AST && <p className="mt-1 text-sm text-red-400">{errors.AST}</p>}
                </div>
                
                {/* Inflammatory Markers */}
                <div>
                  <label htmlFor="CRP" className="block text-sm font-medium text-gray-700 mb-1">
                    CRP (mg/L) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="CRP"
                    name="CRP"
                    value={formData.CRP}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.CRP ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter CRP"
                  />
                  {errors.CRP && <p className="mt-1 text-sm text-red-400">{errors.CRP}</p>}
                </div>
                
                <div>
                  <label htmlFor="ESR" className="block text-sm font-medium text-gray-700 mb-1">
                    ESR (mm/hr) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="ESR"
                    name="ESR"
                    value={formData.ESR}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.ESR ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter ESR"
                  />
                  {errors.ESR && <p className="mt-1 text-sm text-red-400">{errors.ESR}</p>}
                </div>
                
                {/* Patient Category and Risk Level */}
                <div>
                  <label htmlFor="Patient_Category" className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="Patient_Category"
                    name="Patient_Category"
                    value={formData.Patient_Category}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.Patient_Category ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select category</option>
                    <option value="At_Risk">At Risk</option>
                    <option value="Normal">Normal</option>
                    <option value="High_Risk">High Risk</option>
                    <option value="Critical">Critical</option>
                  </select>
                  {errors.Patient_Category && <p className="mt-1 text-sm text-red-400">{errors.Patient_Category}</p>}
                </div>
                
                <div>
                  <label htmlFor="Cardiac_Risk_Level" className="block text-sm font-medium text-gray-700 mb-1">
                    Cardiac Risk Level <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="Cardiac_Risk_Level"
                    name="Cardiac_Risk_Level"
                    value={formData.Cardiac_Risk_Level}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.Cardiac_Risk_Level ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter risk level (0-5)"
                    min="0"
                    max="5"
                  />
                  {errors.Cardiac_Risk_Level && <p className="mt-1 text-sm text-red-400">{errors.Cardiac_Risk_Level}</p>}
                </div>
                
                <div className="md:col-span-2 lg:col-span-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting...' : 'Submit Cardiac Test'}
                  </button>
                </div>
              </form>
            </div>
            {result && (
              <div className="bg-white border border-cyan-400/20 rounded-xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Test Results</h2>
                <div className="bg-slate-50 border border-cyan-200 rounded-lg p-4">
                  <pre className="text-slate-800 whitespace-pre-wrap break-words">
                    {typeof result === 'object' ? JSON.stringify(result, null, 2) : result}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
