"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Recommendation {
  id: string;
  doctor_id: string;
  doctor_name: string;
  patient_id: string;
  patient_name: string;
  date: string;
  recommendation: string;
}

export default function Home() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [labComparison, setLabComparison] = useState<any>(null);
  const [jsonGroup1, setJsonGroup1] = useState<any>(null);
  const [jsonGroup2, setJsonGroup2] = useState<any>(null);
  const [recommendedTests, setRecommendedTests] = useState<string[] | null>(null);
  const [doctorRecommendations, setDoctorRecommendations] = useState<Recommendation[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setTestResult("Please upload a valid image (JPEG, PNG, etc.)");
      return;
    }

    setUploadedFile(file);
    
    // Clear previous results
    setTestResult(null);
    setLabComparison(null);
    setPatientInfo(null);
    setJsonGroup1(null);
    setJsonGroup2(null);

    // Preview image
    const reader = new FileReader();
    reader.onload = () => setFilePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyzeImage = async () => {
    if (!uploadedFile) return;

    setAnalyzing(true);
    setTestResult("AI is analyzing your medical document...");

    try {
      // Convert image → base64
      const base64Image = await new Promise<string>((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve((fr.result as string).split(",")[1]);
        fr.onerror = reject;
        fr.readAsDataURL(uploadedFile);
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

STEP 5 – RECOMMENDED NEXT TESTS
Based on the lab report analysis, recommend what type of tests the patient should do next.
- If abnormalities are found, suggest relevant follow-up tests (e.g., "ECG", "Echocardiogram", "CT Scan", "MRI", "Additional Blood Tests", "Ultrasound", etc.)
- If all values are normal and no follow-up is needed, set recommendedTests to an empty array []
- Be specific about test names
- Consider the patient's age, gender, and abnormal values when recommending tests

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
                      mime_type: uploadedFile.type,
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
      console.log(parsed);
      // 7️⃣ Non-medical document handling
      if (!parsed.isMedical) {
        setTestResult(parsed.error);
        setAnalyzing(false);
        return;
      }

      // 8️⃣ SUCCESS → store & display
      setTestResult(parsed.summary);

      // Optional state saves
      setPatientInfo(parsed.patientInfo);
      setLabComparison(parsed.labComparison);
      setJsonGroup1(parsed.extractedJsonGroup1);
      setJsonGroup2(parsed.extractedJsonGroup2);
      setRecommendedTests(parsed.recommendedTests || []);
      setAnalyzing(false);
    } catch (error: any) {
      console.error("Gemini Error:", error);
      setTestResult("AI analysis failed. Please try again.");
      setAnalyzing(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFilePreview(null);
    setTestResult(null);
    setLabComparison(null);
    setPatientInfo(null);
    setJsonGroup1(null);
    setJsonGroup2(null);
    setRecommendedTests(null);
    setAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem('access_token');
      setIsLoggedIn(!!accessToken);
    };

    checkAuth();
    // Also check on storage events (when localStorage changes in other tabs)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Fetch doctor recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) return;

      setLoadingRecommendations(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
        const response = await fetch(`${baseUrl}/api/recommendations/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Sort by date (newest first)
          const sortedData = data.sort((a: Recommendation, b: Recommendation) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setDoctorRecommendations(sortedData);
        } else {
          console.error('Failed to fetch recommendations');
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    if (isLoggedIn) {
      fetchRecommendations();
    }
  }, [isLoggedIn]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    router.push('/login');
  };

  // Handle login redirect
  const handleLogin = () => {
    router.push('/login');
  };

  // Mock patient history data
  const patientHistory = [
    {
      date: "2024-01-15",
      test: "ECG Test",
      result: "Normal",
      doctor: "Dr. Smith",
    },
    {
      date: "2023-12-10",
      test: "Blood Test",
      result: "Normal",
      doctor: "Dr. Johnson",
    },
    {
      date: "2023-11-05",
      test: "ECG Test",
      result: "Minor Irregularity",
      doctor: "Dr. Smith",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">
            AI Diagnostic Dashboard
          </h1>
          <div className="flex gap-4">
            {isLoggedIn ? (
              <>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  Profile
                </button>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={handleLogin}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Image Upload & Test Result */}
          <div className="space-y-6">
            {/* Image Upload Section */}
            <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-400"
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
                </div>
                <h2 className="text-xl font-bold text-white">IMAGE UPLOAD</h2>
              </div>

              {!uploadedFile ? (
                <div className="border-2 border-dashed border-[#2a2a3e] rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-4"
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
                        Click to upload Image
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        or drag and drop (JPG, PNG, etc.)
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
                          <p className="text-green-400 font-medium">
                            IMAGE LOADED
                          </p>
                          <p className="text-gray-400 text-sm">
                            {uploadedFile.name}
                          </p>
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

                  {/* Submit Button */}
                  <button
                    onClick={handleAnalyzeImage}
                    disabled={analyzing}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-lg shadow-green-500/20"
                  >
                    {analyzing ? 'Analyzing...' : 'Analyze Image'}
                  </button>
                </div>
              )}
            </div>

            {/* Test Result Section */}
            {testResult && (
              <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">TEST RESULT</h2>
                </div>
                <div className="bg-[#0f0f1a] border border-blue-500/30 rounded-lg p-4">
                  <p className="text-gray-300 leading-relaxed">{testResult}</p>
                </div>
              </div>
            )}
  {/* Recommended Next Tests Section */}
  {recommendedTests !== null && (
              <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-6">
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">RECOMMENDED NEXT TESTS</h2>
                </div>
                <div className="bg-[#0f0f1a] border border-purple-500/30 rounded-lg p-4">
                  {recommendedTests.length === 0 ? (
                    <div className="text-center py-4">
                      <div className="flex items-center justify-center mb-2">
                        <svg
                          className="w-12 h-12 text-green-400"
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
                      <p className="text-green-400 font-medium text-lg mb-1">
                        No Additional Tests Required
                      </p>
                      <p className="text-gray-400 text-sm">
                        Based on the lab report analysis, all values are within normal range. No follow-up tests are needed at this time.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-gray-300 mb-3">
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
              </div>
            )}
            {/* Lab Comparison Table Section */}
            {labComparison && labComparison.length > 0 && (
              <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">LAB COMPARISON</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-[#0f0f1a] border-b border-[#2a2a3e]">
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
                            <span className="px-2 py-1 bg-[#0f0f1a] rounded text-white">
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

          
          </div>

          {/* Right Column: Patient History & Doctor Recommendations */}
          <div className="space-y-6">
                      
            {/* Diagnostic Test Buttons */}
            <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">DIAGNOSTIC TESTS</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button 
                  onClick={() => window.location.href = '/cardiac'}
                  className="bg-[#0f0f1a] hover:bg-[#1f1f2f] border border-[#2a2a3e] rounded-lg p-4 transition-colors flex flex-col items-center justify-center"
                >
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center mb-2">
                    <svg
                      className="w-5 h-5 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-white font-medium">Cardiac Test</span>
                </button>
                          
                <button 
                  onClick={() => window.location.href = '/heart'}
                  className="bg-[#0f0f1a] hover:bg-[#1f1f2f] border border-[#2a2a3e] rounded-lg p-4 transition-colors flex flex-col items-center justify-center"
                >
                  <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center mb-2">
                    <svg
                      className="w-5 h-5 text-pink-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-white font-medium">Heart Test</span>
                </button>
                          
                <button 
                  onClick={() => window.location.href = '/diabetic'}
                  className="bg-[#0f0f1a] hover:bg-[#1f1f2f] border border-[#2a2a3e] rounded-lg p-4 transition-colors flex flex-col items-center justify-center"
                >
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-2">
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                      />
                    </svg>
                  </div>
                  <span className="text-white font-medium">Diabetic Test</span>
                </button>
              </div>
            </div>
                     {/* Doctor Recommendations Section */}
            <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">
                  DOCTOR RECOMMENDATIONS
                </h2>
              </div>
              <div className="space-y-4">
                {loadingRecommendations ? (
                  <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg p-4 text-center text-gray-400">
                    Loading recommendations...
                  </div>
                ) : doctorRecommendations.length === 0 ? (
                  <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg p-4 text-center text-gray-400">
                    No recommendations available yet
                  </div>
                ) : (
                  doctorRecommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-[#0f0f1a] border border-cyan-500/30 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-cyan-400 font-semibold">
                            {rec.doctor_name}
                          </p>
                          <p className="text-gray-400 text-sm">{formatDate(rec.date)}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        {rec.recommendation}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>   
            {/* Patient History Section */}
            <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-6">
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
                <h2 className="text-xl font-bold text-white">
                  PATIENT HISTORY
                </h2>
              </div>
              <div className="space-y-3">
                {patientHistory.map((record, index) => (
                  <div
                    key={index}
                    className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg p-4 hover:border-purple-500/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white font-medium">{record.test}</p>
                        <p className="text-gray-400 text-sm">{record.date}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          record.result === "Normal"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {record.result}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Reviewed by: {record.doctor}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          
          </div>
        </div>
      </div>
    </div>
  );
}
