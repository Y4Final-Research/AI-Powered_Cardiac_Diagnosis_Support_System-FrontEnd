const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const savePatientHistory = async (payload: any) => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) return;

  await fetch(`${baseUrl}/api/patient-history`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

export const fetchPatientHistory = async () => {
  const accessToken = localStorage.getItem("access_token");
  const userId = localStorage.getItem("user_id");

  if (!accessToken || !userId) return [];

  const response = await fetch(
    `${baseUrl}/api/patient-history?user_id=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) return [];

  return await response.json();
};