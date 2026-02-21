"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Chart imports
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import ImageUploader from "@/components/ImageUploader";
import DoctorRecommendations from "@/components/DoctorRecommendations";
import DiagnosticButtons from "@/components/DiagnosticButtons";
import PatientHistorySection from "@/components/PatientHistorySection";
import LabComparisonTable from "@/components/LabComparisonTable";
import TestResultCard from "@/components/TestResultCard";
import RecommendedTestsCard from "@/components/RecommendedTestsCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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
  const [patientHistoryData, setPatientHistoryData] = useState<any[]>([]);
  const [loadingPatientHistory, setLoadingPatientHistory] = useState(false);
  const [selectedPatientHistory, setSelectedPatientHistory] = useState<any>(null);
  const [showCharts, setShowCharts] = useState(false);
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
    setRecommendedTests(null);
    setSelectedPatientHistory(null);

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
      const GEMINI_API_KEY = "AIzaSyDNr6mBxd_3P5Cu-Uza7QCOPRUF9KnzWKk";

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

      // Call diabetic API if extractedJsonGroup1 data is available
      if (parsed.extractedJsonGroup1 && Object.keys(parsed.extractedJsonGroup1).length > 0) {
        try {
          const userId = localStorage.getItem('user_id');
          const accessToken = localStorage.getItem('access_token');

          if (userId && accessToken) {
            // Build diabetic data ensuring all fields are present
            const diabeticData = {
              userId: userId,
              Age: parsed.extractedJsonGroup1.Age ?? null,
              BMI: parsed.extractedJsonGroup1.BMI ?? null,
              BUN: parsed.extractedJsonGroup1.BUN ?? null,
              Chol: parsed.extractedJsonGroup1.Chol ?? null,
              Cr: parsed.extractedJsonGroup1.Cr ?? null,
              Gender: parsed.extractedJsonGroup1.Gender ?? null,
              HDL: parsed.extractedJsonGroup1.HDL ?? null,
              LDL: parsed.extractedJsonGroup1.LDL ?? null,
              TG: parsed.extractedJsonGroup1.TG ?? null
            };

            // Remove undefined values but keep null values
            const filteredData = Object.fromEntries(
              Object.entries(diabeticData).filter(([_, v]) => v !== undefined)
            );
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
            console.log('Sending diabetic data:', filteredData);
            const response = await fetch(`${baseUrl}/api/diabetic/`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(filteredData),
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error('Failed to call diabetic API:', response.status, errorText);
            } else {
              const diabeticResult = await response.json();
              console.log('Diabetic API result:', diabeticResult);
            }
          } else {
            console.warn('User ID or access token not found in localStorage for diabetic API call');
          }
        } catch (error) {
          console.error('Error calling diabetic API:', error);
        }
      }

      // Call heart API if extractedJsonGroup2 data is available
      if (parsed.extractedJsonGroup2 && Object.keys(parsed.extractedJsonGroup2).length > 0) {
        try {
          const userId = localStorage.getItem('user_id');
          const accessToken = localStorage.getItem('access_token');

          if (userId && accessToken) {
            const heartData = {
              userId: userId,
              age: parsed.extractedJsonGroup2.age ?? null,
              ca: parsed.extractedJsonGroup2.ca ?? null,
              chol: parsed.extractedJsonGroup2.chol ?? null,
              cp: parsed.extractedJsonGroup2.cp ?? null,
              exang: parsed.extractedJsonGroup2.exang ?? null,
              fbs: parsed.extractedJsonGroup2.fbs ?? null,
              oldpeak: parsed.extractedJsonGroup2.oldpeak ?? null,
              restecg: parsed.extractedJsonGroup2.restecg ?? null,
              sex: parsed.extractedJsonGroup2.sex ?? null,
              slope: parsed.extractedJsonGroup2.slope ?? null,
              thal: parsed.extractedJsonGroup2.thal ?? null,
              thalach: parsed.extractedJsonGroup2.thalach ?? null,
              trestbps: parsed.extractedJsonGroup2.trestbps ?? null
            };

            // Remove undefined values but keep null values
            const filteredHeartData = Object.fromEntries(
              Object.entries(heartData).filter(([_, v]) => v !== undefined)
            );

            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
            console.log('Sending heart data:', filteredHeartData);
            const response = await fetch(`${baseUrl}/api/heart/`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(filteredHeartData),
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error('Failed to call heart API:', response.status, errorText);
            } else {
              const heartResult = await response.json();
              console.log('Heart API result:', heartResult);
            }
          } else {
            console.warn('User ID or access token not found in localStorage for heart API call');
          }
        } catch (error) {
          console.error('Error calling heart API:', error);
        }
      }

      // 8️⃣ SUCCESS → store & display
      setTestResult(parsed.summary);

      // Optional state saves
      setPatientInfo(parsed.patientInfo);
      setLabComparison(parsed.labComparison);
      setJsonGroup1(parsed.extractedJsonGroup1);
      setJsonGroup2(parsed.extractedJsonGroup2);
      setRecommendedTests(parsed.recommendedTests || []);

      // Save to database when isMedical is true
      try {
        const userId = localStorage.getItem('user_id');
        const accessToken = localStorage.getItem('access_token');

        if (userId && accessToken) {
          const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
          const response = await fetch(`${baseUrl}/api/patient-history`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: userId,
              extractedJsonGroup1: parsed.extractedJsonGroup1,
              extractedJsonGroup2: parsed.extractedJsonGroup2,
              isMedical: parsed.isMedical,
              labComparison: parsed.labComparison,
              patientInfo: parsed.patientInfo,
              recommendedTests: parsed.recommendedTests || [],
              summary: parsed.summary
            }),
          });

          if (!response.ok) {
            console.error('Failed to save patient history to database:', response.status);
          }
        } else {
          console.warn('User ID or access token not found in localStorage');
        }
      } catch (error) {
        console.error('Error saving patient history to database:', error);
      }

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
    setSelectedPatientHistory(null);
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
      setLoadingRecommendations(true);
      try {
        const { fetchDoctorRecommendations } = await import("@/services/recommendation.service");
        const data = await fetchDoctorRecommendations();
        // Sort by date (newest first)
        const sortedData = data.sort((a: Recommendation, b: Recommendation) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setDoctorRecommendations(sortedData);
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

  // Fetch patient history
  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingPatientHistory(true);
      try {
        const { fetchPatientHistory } = await import("@/services/history.service");
        const data = await fetchPatientHistory();
        // Sort by date (newest first)
        const sortedData = data.sort((a: any, b: any) =>
          new Date(b.date || b.created_at || b.timestamp).getTime() -
          new Date(a.date || a.created_at || a.timestamp).getTime()
        );
        setPatientHistoryData(sortedData);
        console.log('Patient history data:', sortedData);
      } catch (error) {
        console.error('Error fetching patient history:', error);
      } finally {
        setLoadingPatientHistory(false);
      }
    };

    if (isLoggedIn) {
      fetchHistory();
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

  // Generate chart data from patient history
  const generateLabTrendData = () => {
    if (!patientHistoryData || patientHistoryData.length === 0) return null;

    // Sort history by date to show chronological trend
    const sortedHistory = [...patientHistoryData].sort((a, b) =>
      new Date(a.createdAt || a.date || a.created_at || a.timestamp).getTime() -
      new Date(b.createdAt || b.date || b.created_at || b.timestamp).getTime()
    );

    // Extract lab values for key metrics
    const labels = sortedHistory.map(record => {
      const date = new Date(record.createdAt || record.date || record.created_at || record.timestamp);
      return `${date.getDate()}/${date.getMonth() + 1}`; // DD/MM format
    });

    // Prepare datasets for common lab values
    const totalCholesterolData = sortedHistory.map(record => {
      const lab = record.labComparison?.find((item: any) =>
        item.test.toLowerCase().includes('total cholesterol')
      );
      return lab ? lab.actualValue : null;
    });

    const ldlData = sortedHistory.map(record => {
      const lab = record.labComparison?.find((item: any) =>
        item.test.toLowerCase().includes('ldl')
      );
      return lab ? lab.actualValue : null;
    });

    const hdlData = sortedHistory.map(record => {
      const lab = record.labComparison?.find((item: any) =>
        item.test.toLowerCase().includes('hdl')
      );
      return lab ? lab.actualValue : null;
    });

    const tgData = sortedHistory.map(record => {
      const lab = record.labComparison?.find((item: any) =>
        item.test.toLowerCase().includes('triglycerides') || item.test.toLowerCase().includes('tg')
      );
      return lab ? lab.actualValue : null;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Total Cholesterol',
          data: totalCholesterolData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
        },
        {
          label: 'LDL Cholesterol',
          data: ldlData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.1,
        },
        {
          label: 'HDL Cholesterol',
          data: hdlData,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.1,
        },
        {
          label: 'Triglycerides',
          data: tgData,
          borderColor: 'rgb(255, 205, 86)',
          backgroundColor: 'rgba(255, 205, 86, 0.2)',
          tension: 0.1,
        },
      ],
    };
  };

  const generateNumericChartData = () => {
    if (!patientHistoryData || patientHistoryData.length === 0) return null;

    // Sort history by date
    const sortedHistory = [...patientHistoryData].sort((a, b) =>
      new Date(a.createdAt || b.date || b.created_at || b.timestamp).getTime() -
      new Date(b.createdAt || b.date || b.created_at || b.timestamp).getTime()
    );

    const labels = sortedHistory.map(record => {
      const date = new Date(record.createdAt || record.date || record.created_at || record.timestamp);
      return `${date.getDate()}/${date.getMonth() + 1}`; // DD/MM format
    });

    // Extract numeric values from extractedJsonGroup1
    const ageData = sortedHistory.map(record => record.extractedJsonGroup1?.Age || null);
    const bmiData = sortedHistory.map(record => record.extractedJsonGroup1?.BMI || null);

    return {
      labels,
      datasets: [
        {
          label: 'Age',
          data: ageData,
          borderColor: 'rgb(153, 102, 255)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          tension: 0.1,
        },
        {
          label: 'BMI',
          data: bmiData,
          borderColor: 'rgb(255, 159, 64)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          tension: 0.1,
        }
      ],
    };
  };

  const labTrendData = generateLabTrendData();
  const numericData = generateNumericChartData();

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

  // Load patient history data into display sections
  const loadPatientHistory = (historyItem: any) => {
    setSelectedPatientHistory(historyItem);

    // Load summary into test result
    if (historyItem.summary) {
      setTestResult(historyItem.summary);
    }

    // Load lab comparison data
    if (historyItem.labComparison) {
      setLabComparison(historyItem.labComparison);
    }

    // Load patient info
    if (historyItem.patientInfo) {
      setPatientInfo(historyItem.patientInfo);
    }

    // Load extracted JSON groups
    if (historyItem.extractedJsonGroup1) {
      setJsonGroup1(historyItem.extractedJsonGroup1);
    }

    if (historyItem.extractedJsonGroup2) {
      setJsonGroup2(historyItem.extractedJsonGroup2);
    }

    // Load recommended tests
    if (historyItem.recommendedTests) {
      setRecommendedTests(historyItem.recommendedTests);
    }

    // Scroll to top to show the loaded data
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">
            AI Diagnostic Dashboard
          </h1>
          <div className="flex gap-4">
            {isLoggedIn ? (
              <>
                {/* <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  Profile
                </button> */}
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

        <div className="grid grid-cols-1 gap-6">
  
  {/* Image Upload Section */}
  <ImageUploader
    uploadedFile={uploadedFile}
    filePreview={filePreview}
    analyzing={analyzing}
    handleFileUpload={handleFileUpload}
    handleRemoveFile={handleRemoveFile}
    handleAnalyzeImage={handleAnalyzeImage}
    fileInputRef={fileInputRef}
  />

  {/* Test Result Section */}
  {testResult && (
    <TestResultCard testResult={testResult} />
  )}

  {/* Recommended Next Tests Section */}
  {recommendedTests !== null && (
    <RecommendedTestsCard recommendedTests={recommendedTests} />
  )}

  {/* Lab Comparison Table Section */}
  {labComparison && labComparison.length > 0 && (
    <LabComparisonTable labComparison={labComparison} />
  )}

  {/* Diagnostic Test Buttons */}
  <DiagnosticButtons />

  {/* Doctor Recommendations Section */}
  <DoctorRecommendations
    doctorRecommendations={doctorRecommendations}
    loadingRecommendations={loadingRecommendations}
    formatDate={formatDate}
  />

  {/* Patient History Section */}
  <PatientHistorySection
    patientHistoryData={patientHistoryData}
    loadingPatientHistory={loadingPatientHistory}
    selectedPatientHistory={selectedPatientHistory}
    loadPatientHistory={loadPatientHistory}
    labTrendData={labTrendData}
    numericData={numericData}
    showCharts={showCharts}
    setShowCharts={setShowCharts}
    formatDate={formatDate}
  />

</div>
      </div>
    </div>
  );
}