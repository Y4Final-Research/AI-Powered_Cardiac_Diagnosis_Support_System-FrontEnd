import { useState } from 'react';

export function useImageAnalysis() {
  const [analyzing, setAnalyzing] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [labComparison, setLabComparison] = useState<any>(null);
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [jsonGroup1, setJsonGroup1] = useState<any>(null);
  const [jsonGroup2, setJsonGroup2] = useState<any>(null);
  const [recommendedTests, setRecommendedTests] = useState<string[] | null>(null);

  return {
    analyzing,
    setAnalyzing,
    testResult,
    setTestResult,
    labComparison,
    setLabComparison,
    patientInfo,
    setPatientInfo,
    jsonGroup1,
    setJsonGroup1,
    jsonGroup2,
    setJsonGroup2,
    recommendedTests,
    setRecommendedTests,
  };
}
