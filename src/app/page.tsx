'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      
      // Create preview URL for PDF
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
      
      // Simulate test result (in real app, this would come from AI/backend)
      setTimeout(() => {
        setTestResult('Test analysis completed. Results show normal ECG patterns with no significant abnormalities detected.');
      }, 1000);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFilePreview(null);
    setTestResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Mock patient history data
  const patientHistory = [
    { date: '2024-01-15', test: 'ECG Test', result: 'Normal', doctor: 'Dr. Smith' },
    { date: '2023-12-10', test: 'Blood Test', result: 'Normal', doctor: 'Dr. Johnson' },
    { date: '2023-11-05', test: 'ECG Test', result: 'Minor Irregularity', doctor: 'Dr. Smith' },
  ];

  // Mock doctor recommendations
  const doctorRecommendations = [
    {
      date: '2024-01-20',
      doctor: 'Dr. Sarah Johnson',
      recommendation: 'Continue with current medication. Schedule follow-up in 3 months. Maintain regular exercise routine.',
    },
    {
      date: '2024-01-15',
      doctor: 'Dr. Michael Smith',
      recommendation: 'ECG results are normal. No immediate concerns. Monitor blood pressure regularly.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">AI Lab Report Diagnostic Dashboard</h1>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Profile
            </button>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: PDF Upload & Test Result */}
          <div className="space-y-6">
            {/* PDF Upload Section */}
            <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">PDF UPLOAD</h2>
              </div>

              {!uploadedFile ? (
                <div className="border-2 border-dashed border-[#2a2a3e] rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label
                    htmlFor="pdf-upload"
                    className="cursor-pointer flex flex-col items-center gap-4"
                  >
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div>
                      <p className="text-gray-300 font-medium">Click to upload PDF</p>
                      <p className="text-gray-500 text-sm mt-1">or drag and drop</p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-[#0f0f1a] border border-green-500/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500/20 rounded flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-green-400 font-medium">PDF LOADED</p>
                          <p className="text-gray-400 text-sm">{uploadedFile.name}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveFile}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* PDF Preview */}
                  {filePreview && (
                    <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg p-4">
                      <iframe
                        src={filePreview}
                        className="w-full h-96 rounded"
                        title="PDF Preview"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Test Result Section */}
            {testResult && (
              <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">TEST RESULT</h2>
                </div>
                <div className="bg-[#0f0f1a] border border-blue-500/30 rounded-lg p-4">
                  <p className="text-gray-300 leading-relaxed">{testResult}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Patient History & Doctor Recommendations */}
          <div className="space-y-6">
            {/* Patient History Section */}
            <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">PATIENT HISTORY</h2>
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
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        record.result === 'Normal' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {record.result}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">Reviewed by: {record.doctor}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor Recommendations Section */}
            <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">DOCTOR RECOMMENDATIONS</h2>
              </div>
              <div className="space-y-4">
                {doctorRecommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="bg-[#0f0f1a] border border-cyan-500/30 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-cyan-400 font-semibold">{rec.doctor}</p>
                        <p className="text-gray-400 text-sm">{rec.date}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{rec.recommendation}</p>
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
