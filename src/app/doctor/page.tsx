"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Heart,
  Loader,
  X,
} from "lucide-react";
import Header from "@/components/header";
import SideNavigation from "@/components/side-navigation";

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
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [patientHistory, setPatientHistory] = useState<any[]>([]);
  const [loadingPatientHistory, setLoadingPatientHistory] = useState<boolean>(false);
  const [selectedPatientHistory, setSelectedPatientHistory] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [labComparison, setLabComparison] = useState<any>(null);
  const [recommendedTests, setRecommendedTests] = useState<string[] | null>(null);
  const [recommendation, setRecommendation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submittingRecommendation, setSubmittingRecommendation] = useState(false);
  const [recommendationError, setRecommendationError] = useState("");
  const [recommendationSuccess, setRecommendationSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if user is logged in and is a doctor
    const storedUser = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (!storedUser || role !== "doctor") {
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    // Fetch patients list
    const fetchPatients = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) return;

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
        const response = await fetch(`${baseUrl}/api/patients/?skip=0&limit=100`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPatients(data);
        } else {
          console.error("Failed to fetch patients");
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
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

      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) return;

      setLoadingPatientHistory(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
        const response = await fetch(`${baseUrl}/api/patient-history?user_id=${selectedPatient}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPatientHistory(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch patient history");
          setPatientHistory([]);
        }
      } catch (error) {
        console.error("Error fetching patient history:", error);
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
        parsedData = typeof historyItem.analysis_result === "string"
          ? JSON.parse(historyItem.analysis_result)
          : historyItem.analysis_result;
      }
    } catch (e) {
      console.error("Error parsing analysis result in loadPatientHistory:", e);
      parsedData = null;
    }

    // Load summary into test result
    const summary = parsedData?.summary || historyItem.summary || "No summary available";
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("user");
    router.push("/login");
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
    setRecommendationError("");
    setRecommendationSuccess("");

    if (!selectedPatient) {
      setRecommendationError("Please select a patient");
      return;
    }

    if (!recommendation.trim()) {
      setRecommendationError("Please enter a recommendation");
      return;
    }

    setSubmittingRecommendation(true);

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setRecommendationError("Not authenticated");
        setSubmittingRecommendation(false);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const response = await fetch(`${baseUrl}/api/recommendations/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: selectedPatient,
          recommendation: recommendation.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to submit recommendation" }));
        setRecommendationError(errorData.message || errorData.detail || "Failed to submit recommendation");
        setSubmittingRecommendation(false);
        return;
      }

      setRecommendationSuccess("Recommendation submitted successfully!");
      setRecommendation("");
      setTimeout(() => {
        setRecommendationSuccess("");
      }, 3000);
    } catch (error: any) {
      console.error("Recommendation error:", error);
      setRecommendationError(error.message || "An error occurred. Please try again.");
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

  // Add userName for header
  const userName = user?.name || "User";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <Header
        isLoggedIn={!!user}
        userName={userName}
        onLogout={handleLogout}
        onLogin={() => router.push("/login")}
      />

      <div className="flex">
        <SideNavigation />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 pt-6 pb-20 px-6">
          <div className="max-w-6xl mx-auto space-y-6 py-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-cyan-400/20 rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Total Patients</p>
                    <p className="text-3xl font-bold text-slate-900">{patients.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white border border-cyan-400/20 rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Pending Reviews</p>
                    <p className="text-3xl font-bold text-slate-900">0</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white border border-cyan-400/20 rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Completed Reviews</p>
                    <p className="text-3xl font-bold text-slate-900">0</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Selection and Analysis */}
            <div className="bg-white border border-cyan-400/20 rounded-xl p-8 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
                  <Heart className="w-5 h-5 text-cyan-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Patient Analysis</h2>
              </div>

              {/* Patient Selection */}
              <div className="mb-6">
                <label htmlFor="patient-select" className="block text-sm font-medium text-slate-700 mb-2">
                  Select Patient
                </label>
                <select
                  id="patient-select"
                  value={selectedPatient}
                  onChange={(e) => {
                    setTestResult(null);
                    setLabComparison(null);
                    setPatientInfo(null);
                    setRecommendedTests(null);
                    setSelectedPatientHistory(null);
                    setSelectedPatient(e.target.value);
                  }}
                  className="w-full bg-slate-50 border border-cyan-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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
                <div className="bg-white border border-purple-400/20 rounded-xl p-6 mb-6 shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-lg">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Patient History</h2>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {loadingPatientHistory ? (
                      <div className="text-center text-slate-500">
                        Loading patient history...
                      </div>
                    ) : patientHistory.length === 0 ? (
                      <div className="text-center text-slate-500">
                        No patient history available
                      </div>
                    ) : (
                      patientHistory.map((history, index) => {
                        let patientInfo = null;
                        let labComparison = null;
                        let summary = "";
                        try {
                          if (history.analysis_result) {
                            const parsedResult = typeof history.analysis_result === "string"
                              ? JSON.parse(history.analysis_result)
                              : history.analysis_result;
                            patientInfo = parsedResult?.patientInfo || null;
                            labComparison = parsedResult?.labComparison || null;
                            summary = parsedResult?.summary || "";
                          }
                        } catch (e) {
                          patientInfo = null;
                          labComparison = null;
                          summary = "";
                        }
                        return (
                          <div
                            key={history.id || index}
                            onClick={() => loadPatientHistory(history)}
                            className={`bg-slate-50 border rounded-lg p-4 transition-colors cursor-pointer ${
                              selectedPatientHistory === history
                                ? "border-purple-500 shadow-lg"
                                : "border-slate-200 hover:border-purple-400"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="text-slate-900 font-medium">{summary || "Medical Report"}</p>
                                <p className="text-slate-500 text-xs">
                                  {new Date(history.created_at || history.timestamp || "").toLocaleString()}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  labComparison && labComparison.length > 0 && labComparison.every((item: any) => item.status === "Normal")
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {labComparison && labComparison.length > 0 && labComparison.every((item: any) => item.status === "Normal")
                                  ? "Normal"
                                  : "Abnormal"}
                              </span>
                            </div>
                            <p className="text-slate-500 text-xs">
                              {patientInfo
                                ? `Age: ${patientInfo.age || "N/A"}, Gender: ${patientInfo.gender || "N/A"}`
                                : "Auto-generated Report"}
                            </p>
                            {summary && (
                              <p className="text-slate-700 text-xs mt-2 line-clamp-2">
                                {summary}
                              </p>
                            )}
                            {selectedPatientHistory === history && (
                              <div className="mt-3 pt-3 border-t border-slate-200">
                                <p className="text-purple-600 text-xs font-medium flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4" />
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
                <div
                  onClick={() => selectedPatient && fileInputRef.current?.click()}
                  className={`border-2 border-dashed border-cyan-400/30 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-400/50 hover:bg-cyan-50/30 transition-all ${!selectedPatient ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Upload className="w-12 h-12 text-cyan-500 mx-auto mb-3" />
                  <p className="text-slate-700 font-semibold mb-1">
                    {selectedPatient ? "Click to upload or drag and drop" : "Please select a patient first"}
                  </p>
                  <p className="text-slate-500 text-sm">
                    {selectedPatient && "PNG, JPG, GIF up to 10MB"}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={!selectedPatient}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="font-semibold text-slate-900">{uploadedFile.name}</p>
                        <p className="text-xs text-slate-500">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {filePreview && (
                    <div className="relative rounded-lg overflow-hidden bg-slate-100">
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="max-h-80 mx-auto"
                      />
                    </div>
                  )}
                  {loading && (
                    <div className="bg-slate-100 border border-blue-400/30 rounded-lg p-4 text-center">
                      <Loader className="w-5 h-5 animate-spin text-blue-500 mx-auto mb-2" />
                      <p className="text-blue-500">Analyzing medical document...</p>
                    </div>
                  )}
                </div>
              )}

              {/* Test Result */}
              {testResult && !loading && (
                <div className="bg-white border border-cyan-400/20 rounded-xl p-6 shadow-md mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-5 h-5 text-cyan-600" />
                    <h3 className="text-lg font-bold text-slate-900">Analysis Result</h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{testResult}</p>
                </div>
              )}

              {/* Lab Comparison Table */}
              {labComparison && labComparison.length > 0 && (
                <div className="bg-white border border-cyan-400/20 rounded-xl p-6 shadow-md mt-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Lab Comparison</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-700">
                      <thead className="text-xs text-slate-600 uppercase bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Test</th>
                          <th className="px-4 py-3">Actual Value</th>
                          <th className="px-4 py-3">Normal Range</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {labComparison.map((item: any, index: number) => (
                          <tr
                            key={index}
                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-4 py-3 font-medium">{item.test}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 bg-slate-100 rounded">{item.actualValue}</span>
                            </td>
                            <td className="px-4 py-3">{item.normalRange}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  item.status === "Normal"
                                    ? "bg-green-100 text-green-700"
                                    : item.status === "High"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
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

              {/* Recommended Next Tests */}
              {recommendedTests !== null && (
                <div className="bg-white border border-purple-400/20 rounded-xl p-6 shadow-md mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-bold text-slate-900">Recommended Next Tests</h3>
                  </div>
                  {recommendedTests.length === 0 ? (
                    <div className="text-center py-4">
                      <div className="flex items-center justify-center mb-2">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                      </div>
                      <p className="text-green-600 font-medium">
                        No Additional Tests Required
                      </p>
                      <p className="text-slate-500 text-sm mt-1">
                        Based on the lab report analysis, all values are within normal range. No follow-up tests are needed at this time.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-slate-700 mb-3">
                        Based on the lab report analysis, the following tests are recommended:
                      </p>
                      <ul className="space-y-2">
                        {recommendedTests.map((test, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg"
                          >
                            <span className="text-purple-600 font-bold flex-shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-slate-700">{test}</span>
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
              <div className="bg-white border border-cyan-400/20 rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-cyan-600" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Doctor Recommendation</h2>
                </div>
                <form onSubmit={handleSubmitRecommendation} className="space-y-4">
                  {recommendationError && (
                    <div className="bg-red-100 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                      {recommendationError}
                    </div>
                  )}
                  {recommendationSuccess && (
                    <div className="bg-green-100 border border-green-200 rounded-lg p-3 text-green-700 text-sm">
                      {recommendationSuccess}
                    </div>
                  )}
                  <div>
                    <label htmlFor="recommendation" className="block text-sm font-medium text-slate-700 mb-2">
                      Recommendation
                    </label>
                    <textarea
                      id="recommendation"
                      value={recommendation}
                      onChange={(e) => setRecommendation(e.target.value)}
                      rows={6}
                      className="w-full bg-slate-50 border border-cyan-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                      placeholder="Enter your medical recommendation for the patient..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingRecommendation || !selectedPatient}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-lg shadow-cyan-500/20"
                  >
                    {submittingRecommendation ? "Submitting..." : "Submit Recommendation"}
                  </button>
                </form>
              </div>
            )}

            {/* ...existing code for doctor info, etc... */}
          </div>
        </main>
      </div>
    </div>
  );
}

