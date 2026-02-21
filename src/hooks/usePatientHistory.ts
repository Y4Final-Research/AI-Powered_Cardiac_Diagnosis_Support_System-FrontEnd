import { useState, useEffect } from 'react';

export function usePatientHistory(isLoggedIn: boolean) {
  const [patientHistoryData, setPatientHistoryData] = useState<any[]>([]);
  const [loadingPatientHistory, setLoadingPatientHistory] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingPatientHistory(true);
      try {
        const { fetchPatientHistory } = await import("@/services/history.service");
        const data = await fetchPatientHistory();
        const sortedData = data.sort((a: any, b: any) =>
          new Date(b.date || b.created_at || b.timestamp).getTime() -
          new Date(a.date || a.created_at || a.timestamp).getTime()
        );
        setPatientHistoryData(sortedData);
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

  return { patientHistoryData, loadingPatientHistory };
}
