import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDQuyGltx9wlnybVcydbD9h4hDr5VTiW_Q");

export const getGeminiResponse = async (prompt: string) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash", // or gemini-1.5-pro
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
};
