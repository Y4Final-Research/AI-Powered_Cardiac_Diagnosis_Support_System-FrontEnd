"use client";

import { sendTranscript } from "@/services/clinical.service";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mic, Square, RotateCcw } from "lucide-react";

interface RecorderProps {
  currentState: any;
  onBackendUpdate: (response: any) => void;
}

export default function Recorder({
  currentState,
  onBackendUpdate,
}: RecorderProps) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [buffer, setBuffer] = useState("");
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const sendingRef = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!browserSupportsSpeechRecognition) {
    return (
      <Card className="border-sidebar-border bg-background">
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <p className="text-sm text-destructive font-medium">Browser does not support speech recognition</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  useEffect(() => {
    if (!transcript) return;

    setBuffer((prev) => (prev ? prev + " " + transcript : transcript));

    if (silenceTimer.current) clearTimeout(silenceTimer.current);

    silenceTimer.current = setTimeout(() => {
      flushBuffer();
    }, 2500);
  }, [transcript]);

  const flushBuffer = async () => {
    if (!buffer.trim() || sendingRef.current) return;

    sendingRef.current = true;
    setIsProcessing(true);

    try {
      await sendTranscript(buffer.trim(), currentState, (data) => {
        onBackendUpdate(data);
      });
    } catch (err) {
      console.error("Network error", err);
    } finally {
      sendingRef.current = false;
      setIsProcessing(false);
      setBuffer("");
      resetTranscript();
    }
  };

  const startListening = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: "si-LK",
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
  };

  return (
    <Card className="border-sidebar-border bg-background">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            Voice Input
          </CardTitle>
          <Badge 
            className={listening ? "bg-emerald-500/10 text-emerald-700 border-emerald-200 animate-pulse" : "bg-muted text-muted-foreground"}
          >
            {listening ? "Listening..." : "Stopped"}
          </Badge>
        </div>
      </CardHeader>
      <Separator className="bg-sidebar-border" />
      <CardContent className="pt-4 space-y-4">
        {/* Controls */}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={startListening}
            disabled={listening || isProcessing}
            className="flex items-center gap-2"
          >
            <Mic className="h-4 w-4" />
            Start
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={stopListening}
            disabled={!listening || isProcessing}
            className="flex items-center gap-2"
          >
            <Square className="h-4 w-4" />
            Stop
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={resetTranscript}
            disabled={listening || isProcessing}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Processing indicator */}
        {isProcessing && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-primary font-medium">Processing audio...</p>
          </div>
        )}

        {/* Transcript display */}
        <div className="p-3 rounded-lg bg-muted/30 border border-sidebar-border min-h-24">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Transcript</p>
          <p className="text-sm text-foreground leading-relaxed">
            {transcript || <span className="text-muted-foreground italic">No speech detected...</span>}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
