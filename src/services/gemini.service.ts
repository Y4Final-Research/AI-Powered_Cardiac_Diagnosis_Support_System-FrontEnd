export interface GeminiResponse {
  isMedical: boolean;
  error?: string;
  patientInfo: {
    age: number | null;
    gender: string | null;
  };
  labComparison: any[];
  extractedJsonGroup1: any;
  extractedJsonGroup2: any;
  summary: string;
  recommendedTests: string[];
}

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export const analyzeMedicalImage = async (
  uploadedFile: File,
  prompt: string
): Promise<GeminiResponse> => {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is missing.");
  }

  const base64Image = await new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve((fr.result as string).split(",")[1]);
    fr.onerror = reject;
    fr.readAsDataURL(uploadedFile);
  });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: uploadedFile.type,
                  data: base64Image,
                },
              },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API Error: ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) throw new Error("Empty AI response");

  const cleanedText = rawText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanedText);
};