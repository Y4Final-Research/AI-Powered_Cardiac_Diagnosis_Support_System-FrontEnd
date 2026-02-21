const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const fetchDoctorRecommendations = async () => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) return [];

  const response = await fetch(`${baseUrl}/api/recommendations/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) return [];

  return await response.json();
};