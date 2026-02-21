const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const sendHeartData = async (
  extractedJsonGroup2: any
) => {
  const userId = localStorage.getItem("user_id");
  const accessToken = localStorage.getItem("access_token");

  if (!userId || !accessToken) return;

  const heartData = {
    userId,
    age: extractedJsonGroup2?.age ?? null,
    ca: extractedJsonGroup2?.ca ?? null,
    chol: extractedJsonGroup2?.chol ?? null,
    cp: extractedJsonGroup2?.cp ?? null,
    exang: extractedJsonGroup2?.exang ?? null,
    fbs: extractedJsonGroup2?.fbs ?? null,
    oldpeak: extractedJsonGroup2?.oldpeak ?? null,
    restecg: extractedJsonGroup2?.restecg ?? null,
    sex: extractedJsonGroup2?.sex ?? null,
    slope: extractedJsonGroup2?.slope ?? null,
    thal: extractedJsonGroup2?.thal ?? null,
    thalach: extractedJsonGroup2?.thalach ?? null,
    trestbps: extractedJsonGroup2?.trestbps ?? null,
  };

  await fetch(`${baseUrl}/api/heart/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(heartData),
  });
};