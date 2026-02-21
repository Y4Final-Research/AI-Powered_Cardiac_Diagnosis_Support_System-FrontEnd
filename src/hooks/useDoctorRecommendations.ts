import { useState, useEffect } from 'react';

export function useDoctorRecommendations(isLoggedIn: boolean) {
  const [doctorRecommendations, setDoctorRecommendations] = useState<any[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoadingRecommendations(true);
      try {
        const { fetchDoctorRecommendations } = await import("@/services/recommendation.service");
        const data = await fetchDoctorRecommendations();
        setDoctorRecommendations(data);
      } catch (error) {
        console.error('Error fetching doctor recommendations:', error);
      } finally {
        setLoadingRecommendations(false);
      }
    };
    if (isLoggedIn) {
      fetchRecommendations();
    }
  }, [isLoggedIn]);

  return { doctorRecommendations, loadingRecommendations };
}
