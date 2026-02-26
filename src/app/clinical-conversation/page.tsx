"use client";

import { useState, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, RotateCcw, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface SymptomData {
  value: string;
  status: "pending" | "confirmed" | "approved";
}

interface CurrentState {
  symptoms: Record<string, SymptomData>;
  medical_history: Record<string, SymptomData>;
  allergies: Record<string, SymptomData>;
  risk_factors: Record<string, SymptomData>;
}

interface BackendResponse {
  updated_state: CurrentState;
  missing_critical: {
    symptoms: string[];
    risk_factors: string[];
  };
  translated_text: string;
}

export default function InterviewPage() {
  const [sessionId] = useState(`session_${Date.now()}`);
  const [currentState, setCurrentState] = useState<CurrentState>({
    symptoms: {},
    medical_history: {},
    allergies: {},
    risk_factors: {},
  });
  const [backendResponse, setBackendResponse] =
    useState<BackendResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const delayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const approveItem = (category: keyof CurrentState, key: string) => {
    setCurrentState((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: {
          ...prev[category][key],
          status: "approved",
        },
      },
    }));
  };

  const sendTranscript = async (transcriptText: string) => {
    if (!transcriptText.trim()) return;

    setIsProcessing(true);
    try {
      const response = await fetch("http://localhost:8000/process-transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          transcript_si: transcriptText,
          current_state: currentState,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process transcript");
      }

      const data: BackendResponse = await response.json();
      setBackendResponse(data);
      setCurrentState(data.updated_state);
    } catch (error) {
      console.error("Error processing transcript:", error);
      alert("Failed to process transcript. Make sure the backend is running.");
    } finally {
      setIsProcessing(false);
    }
  };

  const scheduleApiCall = (transcriptText: string) => {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
    }

    delayTimerRef.current = setTimeout(() => {
      sendTranscript(transcriptText);
    }, 15000);
  };

  useEffect(() => {
    if (listening) {
      resetTranscript();
      const timer = setTimeout(() => {
        if (transcript) {
          scheduleApiCall(transcript);
        }
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [listening]);

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    if (transcript) {
      scheduleApiCall(transcript);
    }
  };

  useEffect(() => {
    return () => {
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
      }
    };
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Card className="p-8 max-w-md text-center border-red-500/50 bg-red-950/20">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-300 text-lg">
            Your browser doesn't support speech recognition.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
            Medical Interview
          </h1>
          <p className="text-slate-600">
            Voice-enabled patient consultation system
          </p>
        </motion.div>

        {/* Session Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <Card className="p-4 bg-white border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-sm text-slate-600">Session Active</span>
              </div>
              <span className="font-mono text-xs text-slate-500">{sessionId}</span>
            </div>
          </Card>
        </motion.div>

        {/* Speech Recognition Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-8 bg-white border-slate-200 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">Voice Input</h2>
              <p className="text-slate-600 text-sm mt-1">
                Click the microphone to begin recording
              </p>
            </div>

            {/* Recording Indicator */}
            {listening && (
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mb-6 p-4 bg-blue-50 border border-blue-300 rounded-lg"
              >
                <p className="text-blue-700 text-sm font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  Listening...
                </p>
              </motion.div>
            )}

            {/* Button Controls */}
            <div className="flex gap-3 mb-6 flex-wrap">
              <Button
                onClick={() =>
                  SpeechRecognition.startListening({
                    continuous: true,
                    language: "si-LK",
                  })
                }
                disabled={listening || isProcessing}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium gap-2 shadow-sm"
              >
                <Mic className="w-4 h-4" />
                {listening ? "Recording..." : "Start Recording"}
              </Button>
              <Button
                onClick={handleStopListening}
                disabled={!listening || isProcessing}
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 gap-2"
              >
                <MicOff className="w-4 h-4" />
                Stop
              </Button>
              <Button
                onClick={resetTranscript}
                disabled={listening || isProcessing}
                variant="ghost"
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>

            {/* Processing State */}
            {isProcessing && (
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-lg"
              >
                <p className="text-amber-800 text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Processing speech...
                </p>
              </motion.div>
            )}

            {/* Transcript Display */}
            <div className="bg-slate-50 rounded-lg border border-slate-300 p-4 min-h-28">
              <p className="text-xs text-slate-600 uppercase tracking-wider mb-3 font-semibold">
                Transcript
              </p>
              <p className="text-slate-700 leading-relaxed">
                {transcript || (
                  <span className="text-slate-500 italic">No speech detected...</span>
                )}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Backend Response Section */}
        {backendResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Translation */}
            <Card className="p-6 bg-white border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Translation
              </h3>
              <p className="text-slate-700 leading-relaxed">
                {backendResponse.translated_text}
              </p>
            </Card>

            {/* Current State */}
            <Card className="p-6 bg-white border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">
                Medical Information
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Symptoms */}
                {Object.keys(backendResponse.updated_state.symptoms).length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider text-slate-700">
                      Symptoms
                    </h4>
                    <div className="space-y-3">
                      <AnimatePresence>
                        {Object.entries(backendResponse.updated_state.symptoms)
                          .filter(([_, data]) => data.status !== "approved")
                          .map(([key, data], index) => (
                            <motion.div
                              key={key}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.1,
                              }}
                              className="p-4 rounded-lg bg-amber-50 border border-amber-300"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <p className="text-slate-900 font-medium">
                                    {data.value}
                                  </p>
                                  <Badge variant="secondary" className="mt-1 text-xs">
                                    {data.status}
                                  </Badge>
                                </div>
                                <Button
                                  onClick={() => approveItem("symptoms", key)}
                                  size="sm"
                                  className="bg-emerald-600 hover:bg-emerald-700 gap-1"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Approve
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                      </AnimatePresence>

                      {Object.entries(backendResponse.updated_state.symptoms).some(
                        ([_, data]) => data.status === "approved"
                      ) && (
                        <div className="space-y-2 mt-4">
                          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                            Confirmed
                          </p>
                          <AnimatePresence>
                            {Object.entries(backendResponse.updated_state.symptoms)
                              .filter(([_, data]) => data.status === "approved")
                              .map(([key, data], index) => (
                                <motion.div
                                  key={key}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: index * 0.1,
                                  }}
                                  className="p-3 rounded-lg bg-emerald-50 border border-emerald-300"
                                >
                                  <p className="text-emerald-900 font-medium text-sm">
                                    {data.value}
                                  </p>
                                </motion.div>
                              ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Medical History */}
                {Object.keys(backendResponse.updated_state.medical_history)
                  .length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider text-slate-700">
                      Medical History
                    </h4>
                    <div className="space-y-3">
                      <AnimatePresence>
                        {Object.entries(
                          backendResponse.updated_state.medical_history
                        )
                          .filter(([_, data]) => data.status !== "approved")
                          .map(([key, data], index) => (
                            <motion.div
                              key={key}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.1,
                              }}
                              className="p-4 rounded-lg bg-blue-50 border border-blue-300"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <p className="text-slate-900 font-medium">
                                    {data.value}
                                  </p>
                                  <Badge variant="secondary" className="mt-1 text-xs">
                                    {data.status}
                                  </Badge>
                                </div>
                                <Button
                                  onClick={() =>
                                    approveItem("medical_history", key)
                                  }
                                  size="sm"
                                  className="bg-emerald-600 hover:bg-emerald-700 gap-1"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Approve
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                      </AnimatePresence>

                      {Object.entries(
                        backendResponse.updated_state.medical_history
                      ).some(([_, data]) => data.status === "approved") && (
                        <div className="space-y-2 mt-4">
                          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                            Confirmed
                          </p>
                          <AnimatePresence>
                            {Object.entries(
                              backendResponse.updated_state.medical_history
                            )
                              .filter(([_, data]) => data.status === "approved")
                              .map(([key, data], index) => (
                                <motion.div
                                  key={key}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: index * 0.1,
                                  }}
                                  className="p-3 rounded-lg bg-emerald-50 border border-emerald-300"
                                >
                                  <p className="text-emerald-900 font-medium text-sm">
                                    {data.value}
                                  </p>
                                </motion.div>
                              ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Allergies and Risk Factors */}
              <div className="grid gap-6 md:grid-cols-2 mt-6 pt-6 border-t border-slate-200">
                {/* Allergies */}
                {Object.keys(backendResponse.updated_state.allergies).length >
                  0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider text-slate-700">
                      Allergies
                    </h4>
                    <div className="space-y-3">
                      <AnimatePresence>
                        {Object.entries(backendResponse.updated_state.allergies)
                          .filter(([_, data]) => data.status !== "approved")
                          .map(([key, data], index) => (
                            <motion.div
                              key={key}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.1,
                              }}
                              className="p-4 rounded-lg bg-red-50 border border-red-300"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <p className="text-slate-900 font-medium">
                                    {data.value}
                                  </p>
                                  <Badge variant="secondary" className="mt-1 text-xs">
                                    {data.status}
                                  </Badge>
                                </div>
                                <Button
                                  onClick={() =>
                                    approveItem("allergies", key)
                                  }
                                  size="sm"
                                  className="bg-emerald-600 hover:bg-emerald-700 gap-1"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Approve
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                      </AnimatePresence>

                      {Object.entries(
                        backendResponse.updated_state.allergies
                      ).some(([_, data]) => data.status === "approved") && (
                        <div className="space-y-2 mt-4">
                          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                            Confirmed
                          </p>
                          <AnimatePresence>
                            {Object.entries(
                              backendResponse.updated_state.allergies
                            )
                              .filter(([_, data]) => data.status === "approved")
                              .map(([key, data], index) => (
                                <motion.div
                                  key={key}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: index * 0.1,
                                  }}
                                  className="p-3 rounded-lg bg-emerald-50 border border-emerald-300"
                                >
                                  <p className="text-emerald-900 font-medium text-sm">
                                    {data.value}
                                  </p>
                                </motion.div>
                              ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Risk Factors */}
                {Object.keys(backendResponse.updated_state.risk_factors)
                  .length > 0 && (
                  <div>
                    <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider text-slate-300">
                      Risk Factors
                    </h4>
                    <div className="space-y-3">
                      <AnimatePresence>
                        {Object.entries(
                          backendResponse.updated_state.risk_factors
                        )
                          .filter(([_, data]) => data.status !== "approved")
                          .map(([key, data], index) => (
                            <motion.div
                              key={key}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.1,
                              }}
                              className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/50"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <p className="text-slate-200 font-medium">
                                    {data.value}
                                  </p>
                                  <Badge variant="secondary" className="mt-1 text-xs">
                                    {data.status}
                                  </Badge>
                                </div>
                                <Button
                                  onClick={() =>
                                    approveItem("risk_factors", key)
                                  }
                                  size="sm"
                                  className="bg-emerald-600 hover:bg-emerald-700 gap-1"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Approve
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                      </AnimatePresence>

                      {Object.entries(
                        backendResponse.updated_state.risk_factors
                      ).some(([_, data]) => data.status === "approved") && (
                        <div className="space-y-2 mt-4">
                          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                            Confirmed
                          </p>
                          <AnimatePresence>
                            {Object.entries(
                              backendResponse.updated_state.risk_factors
                            )
                              .filter(([_, data]) => data.status === "approved")
                              .map(([key, data], index) => (
                                <motion.div
                                  key={key}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: index * 0.1,
                                  }}
                                  className="p-3 rounded-lg bg-emerald-50 border border-emerald-300"
                                >
                                  <p className="text-emerald-900 font-medium text-sm">
                                    {data.value}
                                  </p>
                                </motion.div>
                              ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
