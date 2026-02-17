"use client";
import { useState, useEffect } from 'react';
import Header from "@/components/header";
import SideNavigation from "@/components/side-navigation";

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

  // Auth state for header
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | undefined>("User");

  // Fetch data when component mounts
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
        // ignore
      } finally {
        setFetchingData(false);
      }
    };
    fetchData();
  }, []);

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
    if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) < 1 || Number(formData.age) > 120) {
      newErrors.age = 'Age must be a number between 1 and 120';
    }
    // Sex validation (0 or 1)
    if (!formData.sex || (formData.sex !== '0' && formData.sex !== '1')) {
      newErrors.sex = 'Sex must be 0 (Female) or 1 (Male)';
    }
    // CP validation (0-3)
    if (!formData.cp || isNaN(Number(formData.cp)) || Number(formData.cp) < 0 || Number(formData.cp) > 3) {
      newErrors.cp = 'Chest pain type must be between 0 and 3';
    }
    // Trestbps validation (50-300)
    if (!formData.trestbps || isNaN(Number(formData.trestbps)) || Number(formData.trestbps) < 50 || Number(formData.trestbps) > 300) {
      newErrors.trestbps = 'Resting blood pressure must be between 50 and 300';
    }
    // Chol validation (100-600)
    if (!formData.chol || isNaN(Number(formData.chol)) || Number(formData.chol) < 100 || Number(formData.chol) > 600) {
      newErrors.chol = 'Cholesterol must be between 100 and 600';
    }
    // FBS validation (0 or 1)
    if (!formData.fbs || (formData.fbs !== '0' && formData.fbs !== '1')) {
      newErrors.fbs = 'Fasting blood sugar must be 0 or 1';
    }
    // RestECG validation (0-2)
    if (!formData.restecg || isNaN(Number(formData.restecg)) || Number(formData.restecg) < 0 || Number(formData.restecg) > 2) {
      newErrors.restecg = 'Resting ECG must be between 0 and 2';
    }
    // Thalach validation (60-250)
    if (!formData.thalach || isNaN(Number(formData.thalach)) || Number(formData.thalach) < 60 || Number(formData.thalach) > 250) {
      newErrors.thalach = 'Maximum heart rate must be between 60 and 250';
    }
    // Exang validation (0 or 1)
    if (!formData.exang || (formData.exang !== '0' && formData.exang !== '1')) {
      newErrors.exang = 'Exercise induced angina must be 0 or 1';
    }
    // Oldpeak validation (0-10)
    if (!formData.oldpeak || isNaN(Number(formData.oldpeak)) || Number(formData.oldpeak) < 0 || Number(formData.oldpeak) > 10) {
      newErrors.oldpeak = 'ST depression must be between 0 and 10';
    }
    // Slope validation (0-2)
    if (!formData.slope || isNaN(Number(formData.slope)) || Number(formData.slope) < 0 || Number(formData.slope) > 2) {
      newErrors.slope = 'Slope must be between 0 and 2';
    }
    // CA validation (0-4)
    if (!formData.ca || isNaN(Number(formData.ca)) || Number(formData.ca) < 0 || Number(formData.ca) > 4) {
      newErrors.ca = 'Number of vessels must be between 0 and 4';
    }
    // Thal validation (0-3)
    if (!formData.thal || isNaN(Number(formData.thal)) || Number(formData.thal) < 0 || Number(formData.thal) > 3) {
      newErrors.thal = 'Thalassemia must be between 0 and 3';
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
        headers: {
          'Content-Type': 'application/json',
        },
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
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
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
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border border-cyan-400/20 rounded-xl p-8 shadow-md">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Heart Disease Test</h1>
                <p className="text-slate-600">Enter patient data for heart disease risk assessment</p>
                {fetchingData && (
                  <div className="mt-4 text-blue-400 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading your previous data...</span>
                  </div>
                )}
              </div>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.age ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter age"
                  />
                  {errors.age && <p className="mt-1 text-sm text-red-400">{errors.age}</p>}
                </div>
                <div>
                  <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-1">
                    Sex <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="sex"
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.sex ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select sex</option>
                    <option value="0">Female (0)</option>
                    <option value="1">Male (1)</option>
                  </select>
                  {errors.sex && <p className="mt-1 text-sm text-red-400">{errors.sex}</p>}
                </div>
                <div>
                  <label htmlFor="cp" className="block text-sm font-medium text-gray-700 mb-1">
                    Chest Pain Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="cp"
                    name="cp"
                    value={formData.cp}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.cp ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select chest pain type</option>
                    <option value="0">Typical angina (0)</option>
                    <option value="1">Atypical angina (1)</option>
                    <option value="2">Non-anginal pain (2)</option>
                    <option value="3">Asymptomatic (3)</option>
                  </select>
                  {errors.cp && <p className="mt-1 text-sm text-red-400">{errors.cp}</p>}
                </div>
                <div>
                  <label htmlFor="trestbps" className="block text-sm font-medium text-gray-700 mb-1">
                    Resting Blood Pressure <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="trestbps"
                    name="trestbps"
                    value={formData.trestbps}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.trestbps ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter in mm Hg"
                  />
                  {errors.trestbps && <p className="mt-1 text-sm text-red-400">{errors.trestbps}</p>}
                </div>
                <div>
                  <label htmlFor="chol" className="block text-sm font-medium text-gray-700 mb-1">
                    Cholesterol <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="chol"
                    name="chol"
                    value={formData.chol}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.chol ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter in mg/dl"
                  />
                  {errors.chol && <p className="mt-1 text-sm text-red-400">{errors.chol}</p>}
                </div>
                <div>
                  <label htmlFor="fbs" className="block text-sm font-medium text-gray-700 mb-1">
                    Fasting Blood Sugar <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="fbs"
                    name="fbs"
                    value={formData.fbs}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.fbs ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select fasting blood sugar</option>
                    <option value="0">False (&lt; 120 mg/dl)</option>
                    <option value="1">True (&gt; 120 mg/dl)</option>
                  </select>
                  {errors.fbs && <p className="mt-1 text-sm text-red-400">{errors.fbs}</p>}
                </div>
                <div>
                  <label htmlFor="restecg" className="block text-sm font-medium text-gray-700 mb-1">
                    Resting ECG <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="restecg"
                    name="restecg"
                    value={formData.restecg}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.restecg ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select ECG result</option>
                    <option value="0">Normal</option>
                    <option value="1">Abnormal ST-T wave</option>
                    <option value="2">Probable/definite left ventricular hypertrophy</option>
                  </select>
                  {errors.restecg && <p className="mt-1 text-sm text-red-400">{errors.restecg}</p>}
                </div>
                <div>
                  <label htmlFor="thalach" className="block text-sm font-medium text-gray-700 mb-1">
                    Max Heart Rate <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="thalach"
                    name="thalach"
                    value={formData.thalach}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.thalach ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter maximum heart rate"
                  />
                  {errors.thalach && <p className="mt-1 text-sm text-red-400">{errors.thalach}</p>}
                </div>
                <div>
                  <label htmlFor="exang" className="block text-sm font-medium text-gray-700 mb-1">
                    Exercise Induced Angina <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="exang"
                    name="exang"
                    value={formData.exang}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.exang ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                  {errors.exang && <p className="mt-1 text-sm text-red-400">{errors.exang}</p>}
                </div>
                <div>
                  <label htmlFor="oldpeak" className="block text-sm font-medium text-gray-700 mb-1">
                    ST Depression <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="oldpeak"
                    name="oldpeak"
                    value={formData.oldpeak}
                    onChange={handleChange}
                    step="0.1"
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.oldpeak ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter ST depression"
                  />
                  {errors.oldpeak && <p className="mt-1 text-sm text-red-400">{errors.oldpeak}</p>}
                </div>
                <div>
                  <label htmlFor="slope" className="block text-sm font-medium text-gray-700 mb-1">
                    ST Slope <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="slope"
                    name="slope"
                    value={formData.slope}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.slope ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select ST slope</option>
                    <option value="0">Upsloping</option>
                    <option value="1">Flat</option>
                    <option value="2">Downsloping</option>
                  </select>
                  {errors.slope && <p className="mt-1 text-sm text-red-400">{errors.slope}</p>}
                </div>
                <div>
                  <label htmlFor="ca" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Vessels <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="ca"
                    name="ca"
                    value={formData.ca}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.ca ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select number of vessels</option>
                    <option value="0">0 vessels</option>
                    <option value="1">1 vessel</option>
                    <option value="2">2 vessels</option>
                    <option value="3">3 vessels</option>
                    <option value="4">4 vessels</option>
                  </select>
                  {errors.ca && <p className="mt-1 text-sm text-red-400">{errors.ca}</p>}
                </div>
                <div>
                  <label htmlFor="thal" className="block text-sm font-medium text-gray-700 mb-1">
                    Thalassemia <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="thal"
                    name="thal"
                    value={formData.thal}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg ${errors.thal ? 'border-red-500' : 'border-cyan-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select thalassemia</option>
                    <option value="0">Normal</option>
                    <option value="1">Fixed defect</option>
                    <option value="2">Reversible defect</option>
                    <option value="3">Unknown</option>
                  </select>
                  {errors.thal && <p className="mt-1 text-sm text-red-400">{errors.thal}</p>}
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={loading || fetchingData}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {fetchingData ? 'Loading data...' : loading ? 'Submitting...' : 'Submit Heart Disease Test'}
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
