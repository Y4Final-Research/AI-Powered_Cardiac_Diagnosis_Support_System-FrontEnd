// app/api/analyze/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { base64Data, mimeType } = await req.json();

    // Default to PDF MIME type if not provided for backward compatibility
    const actualMimeType = mimeType || "application/pdf";

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyAuwlgNLoyHTAw7Xcl-evWa_IgLJtYK8QU",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze this medical image and provide:
- Key findings
- Any abnormalities detected
- Recommendations if any
- Overall assessment

Provide a detailed but concise analysis.`
                },
                {
                  inline_data: {
                    mime_type: actualMimeType,
                    data: base64Data
                  }
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response";

    return NextResponse.json({ result: text });
  } catch (err: any) {
    console.error("Gemini API error:", err.message);
    return NextResponse.json(
      { error: "Failed to analyze file", details: err.message },
      { status: 500 }
    );
  }
}