'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Patient {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function DoctorPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [patientHistory, setPatientHistory] = useState<any[]>([]);
  const [loadingPatientHistory, setLoadingPatientHistory] = useState<boolean>(false);
  const [selectedPatientHistory, setSelectedPatientHistory] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [labComparison, setLabComparison] = useState<any>(null);
  const [recommendedTests, setRecommendedTests] = useState<string[] | null>(null);
  const [recommendation, setRecommendation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [submittingRecommendation, setSubmittingRecommendation] = useState(false);
  const [recommendationError, setRecommendationError] = useState('');
  const [recommendationSuccess, setRecommendationSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if user is logged in and is a doctor
    const storedUser = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    
    if (!storedUser || role !== 'doctor') {
      router.push('/login');
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    // Fetch patients list
    const fetchPatients = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) return;

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
        const response = await fetch(`${baseUrl}/api/patients/?skip=0&limit=100`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPatients(data);
        } else {
          console.error('Failed to fetch patients');
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    if (user) {
      fetchPatients();
    }
  }, [user]);

  useEffect(() => {
    // Fetch patient history when a patient is selected
    const fetchPatientHistory = async () => {
      if (!selectedPatient) {
        setPatientHistory([]);
        // Clear analysis results when no patient is selected
        setTestResult(null);
        setLabComparison(null);
        setPatientInfo(null);
        setRecommendedTests(null);
        setSelectedPatientHistory(null);
        return;
      }
      
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) return;

      setLoadingPatientHistory(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
        const response = await fetch(`${baseUrl}/api/patient-history?user_id=${selectedPatient}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPatientHistory(Array.isArray(data) ? data : []);
        } else {
          console.error('Failed to fetch patient history');
          setPatientHistory([]);
        }
      } catch (error) {
        console.error('Error fetching patient history:', error);
        setPatientHistory([]);
      } finally {
        setLoadingPatientHistory(false);
      }
    };

    fetchPatientHistory();
  }, [selectedPatient]);

  // Load patient history data into display sections
  const loadPatientHistory = (historyItem: any) => {
    setSelectedPatientHistory(historyItem);
    
    // Try to parse analysis_result if it exists
    let parsedData = null;
    try {
      if (historyItem.analysis_result) {
        parsedData = typeof historyItem.analysis_result === 'string' 
          ? JSON.parse(historyItem.analysis_result) 
          : historyItem.analysis_result;
      }
    } catch (e) {
      console.error('Error parsing analysis result in loadPatientHistory:', e);
      parsedData = null;
    }
    
    // Load summary into test result
    const summary = parsedData?.summary || historyItem.summary || 'No summary available';
    setTestResult(summary);
    
    // Load lab comparison data
    const labComparison = parsedData?.labComparison || historyItem.labComparison || null;
    if (labComparison) {
      setLabComparison(labComparison);
    }
    
    // Load patient info
    const patientInfo = parsedData?.patientInfo || historyItem.patientInfo || null;
    if (patientInfo) {
      setPatientInfo(patientInfo);
    }
    
    // Load recommended tests
    const recommendedTests = parsedData?.recommendedTests || historyItem.recommendedTests || null;
    if (recommendedTests) {
      setRecommendedTests(recommendedTests);
    }
    
    // Scroll to top to show the loaded data
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setTestResult("Please upload a valid image (JPEG, PNG, etc.)");
      return;
    }

    setUploadedFile(file);
    setSelectedPatientHistory(null); // Clear selected history when uploading new file

    // Preview image
    const reader = new FileReader();
    reader.onload = () => setFilePreview(reader.result as string);
    reader.readAsDataURL(file);
    try {
      setTestResult("AI is analyzing your medical document...");
      setLoading(true);

      // Convert image → base64
      const base64Image = await new Promise<string>((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve((fr.result as string).split(",")[1]);
        fr.onerror = reject;
        fr.readAsDataURL(file);
      });

      // 4️⃣ Gemini Prompt (STRICT JSON RESPONSE)
      const PROMPT = `
You are a medical document analysis AI.

STEP 1 – VALIDATION
If this image is NOT a medical report (lab report, blood test, diagnostic report),
respond ONLY with:
{
  "isMedical": false,
  "error": "The uploaded file is not a medical report"
}

STEP 2 – EXTRACTION
If it IS a medical report, extract values if present.

Group 1:
{
  "Age": number,
  "Gender": "M" | "F",
  "BMI": number,
  "Chol": number,
  "TG": number,
  "HDL": number,
  "LDL": number,
  "Cr": number,
  "BUN": number
}

Group 2:
{
  "age": number,
  "sex": number,
  "cp": number,
  "trestbps": number,
  "chol": number,
  "fbs": number,
  "restecg": number,
  "thalach": number,
  "exang": number,
  "oldpeak": number,
  "slope": number,
  "ca": number,
  "thal": number
}

STEP 3 – COMPARISON
For each lab value:
- show actual value
- show normal range
- status: Normal | High | Low

STEP 4 – SUMMARY
Short medical-friendly summary.
DO NOT give a diagnosis.

STEP 5 – RECOMMENDED NEXT TESTS WITH REASONS
Based on the lab report analysis, recommend what type of tests the patient should do next and explain WHY each test is recommended.

Format each recommendation as: "Test Name - Reason for recommendation"

Guidelines:
- If abnormalities are found, suggest relevant follow-up tests with explanations:
  * "ECG - To evaluate heart rhythm abnormalities indicated by elevated troponin levels"
  * "Echocardiogram - To assess heart structure and function due to abnormal cholesterol ratios"
  * "CT Scan - To investigate potential organ damage from elevated liver enzymes"
  * "MRI - To examine soft tissue abnormalities suggested by inflammatory markers"
  * "Additional Blood Tests - To monitor trending values and confirm initial findings"
  * "Ultrasound - To visualize organ structure for abnormalities in size or texture"
  
- If all values are normal and no follow-up is needed, set recommendedTests to an empty array []

Consider these factors when recommending tests:
- Patient's age and gender
- Abnormal lab values and their clinical significance
- Potential underlying conditions suggested by the results
- Standard medical protocols for follow-up care

Example outputs:
- ["ECG - Elevated troponin levels suggest possible cardiac stress"]
- ["Lipid Panel - Abnormal cholesterol ratio indicates cardiovascular risk"]
- [] (empty array when no follow-up needed)

STEP 6 – OUTPUT
Respond ONLY in valid JSON:

{
  "isMedical": true,
  "patientInfo": {
    "age": number | null,
    "gender": string | null
  },
  "labComparison": [
    {
      "test": string,
      "actualValue": number | string,
      "normalRange": string,
      "status": "Normal" | "High" | "Low"
    }
  ],
  "extractedJsonGroup1": {},
  "extractedJsonGroup2": {},
  "summary": string,
  "recommendedTests": string[]
}
`;

      // 5️⃣ Call Gemini API

      const GEMINI_API_KEY = "AIzaSyDQuyGltx9wlnybVcydbD9h4hDr5VTiW_Q";

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: PROMPT },
                  {
                    inline_data: {
                      mime_type: file.type,
                      data: base64Image,
                    },
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error("Empty AI response");
      }

      const cleanedText = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleanedText);

      if (!parsed.isMedical) {
        setTestResult(parsed.error);
        setLoading(false);
        return;
      }

      setTestResult(parsed.summary);
      setPatientInfo(parsed.patientInfo);
      setLabComparison(parsed.labComparison);
      setRecommendedTests(parsed.recommendedTests || []);
      setLoading(false);
    } catch (error: any) {
      console.error("Gemini Error:", error);
      setTestResult("AI analysis failed. Please try again.");
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFilePreview(null);
    setTestResult(null);
    setLabComparison(null);
    setPatientInfo(null);
    setRecommendedTests(null);
    setSelectedPatientHistory(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmitRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecommendationError('');
    setRecommendationSuccess('');

    if (!selectedPatient) {
      setRecommendationError('Please select a patient');
      return;
    }

    if (!recommendation.trim()) {
      setRecommendationError('Please enter a recommendation');
      return;
    }

    setSubmittingRecommendation(true);

    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setRecommendationError('Not authenticated');
        setSubmittingRecommendation(false);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/api/recommendations/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: selectedPatient,
          recommendation: recommendation.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to submit recommendation' }));
        setRecommendationError(errorData.message || errorData.detail || 'Failed to submit recommendation');
        setSubmittingRecommendation(false);
        return;
      }

      setRecommendationSuccess('Recommendation submitted successfully!');
      setRecommendation('');
      setTimeout(() => {
        setRecommendationSuccess('');
      }, 3000);
    } catch (error: any) {
      console.error('Recommendation error:', error);
      setRecommendationError(error.message || 'An error occurred. Please try again.');
    } finally {
      setSubmittingRecommendation(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Doctor Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome, {user.name}</p>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Profile
            </button>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Patients</p>
                <p className="text-3xl font-bold text-white">{patients.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Pending Reviews</p>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Completed Reviews</p>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Selection and Image Upload Section */}
        <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">PATIENT ANALYSIS</h2>
          </div>

          {/* Patient Selection */}
          <div className="mb-6">
            <label htmlFor="patient-select" className="block text-sm font-medium text-gray-300 mb-2">
              Select Patient
            </label>
            <select
              id="patient-select"
              value={selectedPatient}
              onChange={(e) => {
                // Clear previous analysis results when changing patients
                setTestResult(null);
                setLabComparison(null);
                setPatientInfo(null);
                setRecommendedTests(null);
                setSelectedPatientHistory(null);
                setSelectedPatient(e.target.value);
              }}
              className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              <option value="">-- Select a patient --</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} ({patient.email})
                </option>
              ))}
            </select>
          </div>

          {/* Patient History Section */}
          {selectedPatient && (
            <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">PATIENT HISTORY</h2>
              </div>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {loadingPatientHistory ? (
                  <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg p-4 text-center text-gray-400">
                    Loading patient history...
                  </div>
                ) : patientHistory.length === 0 ? (
                  <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg p-4 text-center text-gray-400">
                    No patient history available
                  </div>
                ) : (
                  patientHistory.map((history, index) => {
                    // Parse the analysis_result to get patient info
                    let patientInfo = null;
                    let labComparison = null;
                    let summary = '';
                    
                    try {
                      // Check if analysis_result exists and is not null/undefined
                      if (history.analysis_result) {
                        const parsedResult = typeof history.analysis_result === 'string' 
                          ? JSON.parse(history.analysis_result) 
                          : history.analysis_result;
                        
                        patientInfo = parsedResult?.patientInfo || null;
                        labComparison = parsedResult?.labComparison || null;
                        summary = parsedResult?.summary || '';
                      }
                    } catch (e) {
                      console.error('Error parsing analysis result:', e);
                      // Set defaults if parsing fails
                      patientInfo = null;
                      labComparison = null;
                      summary = '';
                    }
                    
                    return (
                      <div
                        key={history.id || index}
                        onClick={() => loadPatientHistory(history)}
                        className={`bg-[#0f0f1a] border rounded-lg p-4 transition-colors cursor-pointer ${
                          selectedPatientHistory === history 
                            ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                            : 'border-[#2a2a3e] hover:border-purple-500/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-white font-medium">{summary || 'Medical Report'}</p>
                            <p className="text-gray-400 text-sm">
                              {new Date(history.created_at || history.timestamp || '').toLocaleString()}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              labComparison && labComparison.length > 0 && labComparison.every((item: any) => item.status === 'Normal')
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}
                          >
                            {labComparison && labComparison.length > 0 && labComparison.every((item: any) => item.status === 'Normal') 
                              ? 'Normal' 
                              : 'Abnormal'}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {patientInfo 
                            ? `Age: ${patientInfo.age || 'N/A'}, Gender: ${patientInfo.gender || 'N/A'}` 
                            : 'Auto-generated Report'}
                        </p>
                        {summary && (
                          <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                            {summary}
                          </p>
                        )}
                        {selectedPatientHistory === history && (
                          <div className="mt-3 pt-3 border-t border-[#2a2a3e]">
                            <p className="text-purple-400 text-xs font-medium flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Loaded - Click to reload
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Image Upload */}
          {!uploadedFile ? (
            <div className="border-2 border-dashed border-[#2a2a3e] rounded-lg p-8 text-center hover:border-green-500 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="image-upload"
                disabled={!selectedPatient}
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer flex flex-col items-center gap-4 ${!selectedPatient ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <div>
                  <p className="text-gray-300 font-medium">
                    {selectedPatient ? 'Click to upload Image' : 'Please select a patient first'}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {selectedPatient && 'or drag and drop (JPG, PNG, etc.)'}
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-[#0f0f1a] border border-green-500/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-green-400 font-medium">IMAGE LOADED</p>
                      <p className="text-gray-400 text-sm">{uploadedFile.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Image Preview */}
              {filePreview && (
                <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg p-4">
                  <img
                    src={filePreview}
                    className="w-full h-96 object-contain rounded"
                    alt="Uploaded medical image preview"
                  />
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="bg-[#0f0f1a] border border-blue-500/30 rounded-lg p-4 text-center">
                  <p className="text-blue-400">Analyzing medical document...</p>
                </div>
              )}
            </div>
          )}

          {/* Test Result - Always visible when data exists */}
          {testResult && !loading && (
            <div className="bg-[#0f0f1a] border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Analysis Result</h3>
              <p className="text-gray-300 leading-relaxed">{testResult}</p>
            </div>
          )}

          {/* Lab Comparison Table - Always visible when data exists */}
          {labComparison && labComparison.length > 0 && (
            <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4">Lab Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                  <thead className="text-xs text-gray-300 uppercase bg-[#1a1a2e] border-b border-[#2a2a3e]">
                    <tr>
                      <th scope="col" className="px-4 py-3">Test</th>
                      <th scope="col" className="px-4 py-3">Actual Value</th>
                      <th scope="col" className="px-4 py-3">Normal Range</th>
                      <th scope="col" className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labComparison.map((item: any, index: number) => (
                      <tr
                        key={index}
                        className="border-b border-[#2a2a3e] hover:bg-[#202030] transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-white">{item.test}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-[#1a1a2e] rounded text-white">
                            {item.actualValue}
                          </span>
                        </td>
                        <td className="px-4 py-3">{item.normalRange}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              item.status === 'Normal'
                                ? 'bg-green-500/20 text-green-400'
                                : item.status === 'High'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recommended Next Tests Section - Always visible when data exists */}
          {recommendedTests !== null && (
            <div className="bg-[#0f0f1a] border border-purple-500/30 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                Recommended Next Tests
              </h3>
              {recommendedTests.length === 0 ? (
                <div className="text-center py-4">
                  <div className="flex items-center justify-center mb-2">
                    <svg
                      className="w-10 h-10 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-green-400 font-medium">
                    No Additional Tests Required
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Based on the lab report analysis, all values are within normal range. No follow-up tests are needed at this time.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-300 text-sm">
                    Based on the lab report analysis, the following tests are recommended:
                  </p>
                  <ul className="space-y-2">
                    {recommendedTests.map((test, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 p-3 bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg hover:border-purple-500/50 transition-colors"
                      >
                        <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-purple-400 text-xs font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-white font-medium">{test}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Doctor Recommendation Section */}
        {selectedPatient && (
          <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">DOCTOR RECOMMENDATION</h2>
            </div>

            <form onSubmit={handleSubmitRecommendation} className="space-y-4">
              {recommendationError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                  {recommendationError}
                </div>
              )}

              {recommendationSuccess && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm">
                  {recommendationSuccess}
                </div>
              )}

              <div>
                <label htmlFor="recommendation" className="block text-sm font-medium text-gray-300 mb-2">
                  Recommendation
                </label>
                <textarea
                  id="recommendation"
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  rows={6}
                  className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                  placeholder="Enter your medical recommendation for the patient..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingRecommendation || !selectedPatient}
                className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-lg shadow-cyan-500/20"
              >
                {submittingRecommendation ? 'Submitting...' : 'Submit Recommendation'}
              </button>
            </form>
          </div>
        )}

        {/* Doctor Information */}
        <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">DOCTOR INFORMATION</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Name</p>
              <p className="text-white font-medium">{user.name}</p>
            </div>
            <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Email</p>
              <p className="text-white font-medium">{user.email || 'N/A'}</p>
            </div>
            <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Role</p>
              <p className="text-white font-medium capitalize">{user.role}</p>
            </div>
            <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">User ID</p>
              <p className="text-white font-medium text-sm">{user.user_id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

