"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Upload,
  Activity,
  Heart,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  Zap,
  TrendingUp,
  Clock,
  User,
  Brain,
  Sparkles,
} from "lucide-react";
import { NavBar } from "@/components/nav-bar";

/* ================= TYPES ================= */

interface RhythmAnalysis {
  heart_rate: number | string;
  regularity: string;
  rhythm_type: string;
}

interface Abnormalities {
  severity: string;
  affected_leads?: string[];
  abnormalities?: string[];
}

interface Diagnosis {
  urgency: string;
  primary_diagnosis: string;
  differential_diagnoses?: string[];
  recommendations?: string[];
}

interface ECGResults {
  rhythm_analysis: RhythmAnalysis;
  abnormalities: Abnormalities;
  diagnosis: Diagnosis;
}

/* ================= COMPONENT ================= */

function ECGInterpreter() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [patientContext, setPatientContext] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ECGResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const name = localStorage.getItem('name');
    if (!accessToken) {
      router.push('/login');
      return;
    }
    setUserName(name || 'User');
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('user');
    router.push('/login');
  };

  /* ================= FILE SELECT ================= */

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setResults(null);
    setError(null);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  /* ================= ANALYZE ================= */

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select an ECG image");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;

        reader.readAsDataURL(selectedFile);
      });

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Image,
          patientContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const text = await response.text();

      let data: ECGResults;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON response from backend");
      }

      setResults(data);
    } catch (err: any) {
      setError(err.message || "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  /* ================= CLEAR ================= */

  const clearAnalysis = () => {
    setSelectedFile(null);
    setPreview(null);
    setResults(null);
    setPatientContext("");
    setError(null);
  };

  /* ================= UI HELPERS ================= */

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case "emergent":
        return "text-red-400 border-red-500/40 bg-red-500/10";

      case "urgent":
        return "text-orange-400 border-orange-500/40 bg-orange-500/10";

      default:
        return "text-cyan-400 border-cyan-500/40 bg-cyan-500/10";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
      case "severe":
        return "text-red-400";

      case "moderate":
        return "text-orange-400";

      case "mild":
        return "text-yellow-400";

      default:
        return "text-green-400";
    }
  };

  /* ================= RENDER ================= */

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg shadow-cyan-500/30">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-white font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

  {/* HEADER */}
  <NavBar userName={userName} handleLogout={handleLogout} />

  {/* MAIN */}
  <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-5 gap-6">

    {/* LEFT PANEL */}
    <div className="lg:col-span-2 space-y-6">

      {/* UPLOAD */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

        <h2 className="flex gap-2 text-cyan-600 font-bold mb-4">
          <Upload/>
          Upload ECG
        </h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="mb-4 block w-full text-sm text-slate-600
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:bg-cyan-50 file:text-cyan-700
          hover:file:bg-cyan-100"
        />

        {/* PREVIEW */}
        {preview && (
          <div className="relative mb-4">

            <Image
              src={preview}
              alt="preview"
              width={400}
              height={300}
              className="rounded-lg border border-slate-200"
            />

            <button
              onClick={clearAnalysis}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-lg shadow"
            >
              <X/>
            </button>

          </div>
        )}

        {/* CONTEXT */}
        <textarea
          placeholder="Patient context"
          value={patientContext}
          onChange={(e) => setPatientContext(e.target.value)}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

        {/* ERROR */}
        {error && (
          <div className="text-red-600 text-sm mb-4 flex gap-2 bg-red-50 border border-red-200 p-2 rounded-lg">
            <AlertCircle/>
            {error}
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={handleAnalyze}
          disabled={!selectedFile || isAnalyzing}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white disabled:bg-slate-300 disabled:text-slate-500 py-3 rounded-lg font-semibold flex justify-center gap-2 shadow-sm"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="animate-spin"/>
              Analyzing...
            </>
          ) : (
            <>
              <Zap/>
              Run Analysis
            </>
          )}
        </button>

      </div>


      {/* STATS */}
      {results && (
        <div className="grid grid-cols-2 gap-4">

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">

            <TrendingUp className="text-cyan-600"/>

            <div className="text-2xl font-bold text-slate-900">
              {results.rhythm_analysis?.heart_rate}
            </div>

            <div className="text-sm text-slate-500">BPM</div>

          </div>


          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">

            <Clock className="text-cyan-600"/>

            <div className="text-lg font-semibold text-slate-900">
              {results.rhythm_analysis?.regularity}
            </div>

            <div className="text-sm text-slate-500">Regularity</div>

          </div>

        </div>
      )}

    </div>


    {/* RIGHT PANEL */}
    <div className="lg:col-span-3">

      {!results && (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center shadow-sm">

          <Heart className="mx-auto text-cyan-600 w-16 h-16 mb-4"/>

          <p className="text-slate-600 font-medium">
            System Ready
          </p>

        </div>
      )}


      {results && (
        <div className="space-y-6">

          {/* DIAGNOSIS */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

            <div className="flex justify-between mb-4">

              <h3 className="flex gap-2 font-semibold text-slate-800">
                <Brain className="text-cyan-600"/>
                Diagnosis
              </h3>

              <span className={`px-3 py-1 rounded-lg border text-sm font-medium ${getUrgencyColor(results.diagnosis?.urgency)}`}>
                {results.diagnosis?.urgency}
              </span>

            </div>

            <div className="text-xl font-bold text-slate-900">
              {results.diagnosis?.primary_diagnosis}
            </div>

          </div>


          {/* ABNORMALITIES */}
          {results.abnormalities?.abnormalities?.map((a, i) => (
            <div
              key={i}
              className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl shadow-sm"
            >
              {a}
            </div>
          ))}


          {/* RECOMMENDATIONS */}
          {results.diagnosis?.recommendations?.map((r, i) => (
            <div
              key={i}
              className="bg-cyan-50 border border-cyan-200 text-cyan-800 p-4 rounded-xl shadow-sm"
            >
              {r}
            </div>
          ))}

        </div>
      )}

    </div>

  </div>

</div>
  );
}

export default ECGInterpreter;