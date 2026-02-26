export async function sendTranscript(
  transcriptSi: string,
  currentState: any,
  onUpdate: (data: any) => void
) {
  if (!transcriptSi.trim()) return;

  // Ensure all keys exist (initialize if first request)
  const safeState = {
    symptoms: currentState.symptoms || [],
    medical_history: currentState.medical_history || [],
    allergies: currentState.allergies || [],
    risk_factors: currentState.risk_factors || [],
  };

  const res = await fetch("http://localhost:8000/process-transcript", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transcript_si: transcriptSi,
      current_state: safeState,
    }),
  });

  if (!res.ok) {
    console.error("Backend error:", await res.text());
    return;
  }

  const data = await res.json();
  onUpdate(data);
}



export async function updateItemStatus(
  sessionId: string,
  category: string,
  item: string,
  status: "accepted" | "rejected"
) {
  const res = await fetch("http://localhost:8000/update-item-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, category, item, status }),
  });

  if (!res.ok) throw new Error("Backend error");
  return res.json();
}
