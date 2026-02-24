'use client'

import { Sidebar } from '@/components/sideBar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import PatientHistorySection from '@/components/PatientHistorySection'
import LabComparisonTable from '@/components/LabComparisonTable'
import RecommendedTestsCard from '@/components/RecommendedTestsCard'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import router from 'next/router'
import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js'
import { fetchPatientHistory as fetchPatientHistoryService } from '@/services/history.service'

Chart.register(CategoryScale)

export default function Page() {
  const [patientHistoryData, setPatientHistoryData] = useState<any[]>([])
  const [loadingPatientHistory, setLoadingPatientHistory] = useState(false)
  const [selectedPatientHistory, setSelectedPatientHistory] = useState<any>(null)
  const [showCharts, setShowCharts] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem('access_token')
      setIsLoggedIn(!!accessToken)
    }

    checkAuth()
    // Also check on storage events (when localStorage changes in other tabs)
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  // Fetch patient history using service
  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingPatientHistory(true)
      try {
        const data = await fetchPatientHistoryService();
        setPatientHistoryData(data || []);
      } catch (error) {
        console.error('Failed to fetch patient history:', error);
        setPatientHistoryData([]);
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
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Generate chart data from patient history
  const generateLabTrendData = () => {
    if (!patientHistoryData || patientHistoryData.length === 0) return null

    // Sort history by date to show chronological trend
    const sortedHistory = [...patientHistoryData].sort((a, b) =>
      new Date(a.createdAt || a.date || a.created_at || a.timestamp).getTime() -
      new Date(b.createdAt || b.date || b.created_at || b.timestamp).getTime()
    )

    // Extract lab values for key metrics
    const labels = sortedHistory.map(record => {
      const date = new Date(record.createdAt || record.date || record.created_at || record.timestamp)
      return `${date.getDate()}/${date.getMonth() + 1}` // DD/MM format
    })

    // Prepare datasets for common lab values
    const totalCholesterolData = sortedHistory.map(record => {
      const lab = record.labComparison?.find((item: any) =>
        item.test.toLowerCase().includes('total cholesterol')
      )
      return lab ? lab.actualValue : null
    })

    const ldlData = sortedHistory.map(record => {
      const lab = record.labComparison?.find((item: any) =>
        item.test.toLowerCase().includes('ldl')
      )
      return lab ? lab.actualValue : null
    })

    const hdlData = sortedHistory.map(record => {
      const lab = record.labComparison?.find((item: any) =>
        item.test.toLowerCase().includes('hdl')
      )
      return lab ? lab.actualValue : null
    })

    const tgData = sortedHistory.map(record => {
      const lab = record.labComparison?.find((item: any) =>
        item.test.toLowerCase().includes('triglycerides') || item.test.toLowerCase().includes('tg')
      )
      return lab ? lab.actualValue : null
    })

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
    }
  }

  const generateNumericChartData = () => {
    if (!patientHistoryData || patientHistoryData.length === 0) return null

    // Sort history by date
    const sortedHistory = [...patientHistoryData].sort((a, b) =>
      new Date(a.createdAt || a.date || a.created_at || a.timestamp).getTime() -
      new Date(b.createdAt || b.date || b.created_at || b.timestamp).getTime()
    )

    const labels = sortedHistory.map(record => {
      const date = new Date(record.createdAt || record.date || record.created_at || record.timestamp)
      return `${date.getDate()}/${date.getMonth() + 1}` // DD/MM format
    })

    // Extract numeric values from extractedJsonGroup1
    const ageData = sortedHistory.map(record => record.extractedJsonGroup1?.Age || null)
    const bmiData = sortedHistory.map(record => record.extractedJsonGroup1?.BMI || null)

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
        },
      ],
    }
  }


  // Load patient history data into display sections (matching lab-reports logic)
  const [testResult, setTestResult] = useState<string | null>(null);
  const [labComparison, setLabComparison] = useState<any>(null);
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [jsonGroup1, setJsonGroup1] = useState<any>(null);
  const [jsonGroup2, setJsonGroup2] = useState<any>(null);
  const [recommendedTests, setRecommendedTests] = useState<string[] | null>(null);

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
  }


 // Handle login redirect
  const handleLogin = () => {
    router.push('/login')
  }

  const labTrendData = generateLabTrendData()
  const numericData = generateNumericChartData()

  return (
    <SidebarProvider>
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content with SidebarInset */}
      <SidebarInset className="flex min-h-screen flex-col bg-slate-100">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">Patient History</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {isLoggedIn ? (
            <div className="space-y-6">
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

              {/* Show LabComparisonTable and RecommendedTestsCard if a history is selected */}
              {selectedPatientHistory && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <LabComparisonTable labComparison={labComparison} />
                  <RecommendedTestsCard recommendedTests={recommendedTests ?? []} />
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
                <p className="text-gray-600 mb-6">You need to be logged in to view your patient history</p>
                <button
                  onClick={handleLogin}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
