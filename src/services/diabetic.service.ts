const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const sendDiabeticData = async (
  extractedJsonGroup1: any
) => {
  const userId = localStorage.getItem("user_id");
  const accessToken = localStorage.getItem("access_token");

  if (!userId || !accessToken) return;

  const diabeticData = {
    userId,
    Age: extractedJsonGroup1?.Age ?? null,
    BMI: extractedJsonGroup1?.BMI ?? null,
    BUN: extractedJsonGroup1?.BUN ?? null,
    Chol: extractedJsonGroup1?.Chol ?? null,
    Cr: extractedJsonGroup1?.Cr ?? null,
    Gender: extractedJsonGroup1?.Gender ?? null,
    HDL: extractedJsonGroup1?.HDL ?? null,
    LDL: extractedJsonGroup1?.LDL ?? null,
    TG: extractedJsonGroup1?.TG ?? null,
  };

  await fetch(`${baseUrl}/api/diabetic/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(diabeticData),
  });
};