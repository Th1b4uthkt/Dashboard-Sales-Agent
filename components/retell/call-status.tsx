'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '@/hooks/use-websocket';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CallStatusProps {
  callId: string;
  onEndCall: () => void;
}

interface WebSocketMessage {
  type: string;
  status?: string;
  speaker?: string;
  text?: string;
}

// Définissons un type plus spécifique pour custom_analysis_data
type CustomAnalysisData = {
  [key: string]: string | number | boolean | null | undefined;
};

interface AnalysisData {
  call_summary?: string;
  user_sentiment?: string;
  call_successful?: boolean;
  custom_analysis_data?: CustomAnalysisData;
  // Ajoutez d'autres champs selon vos besoins spécifiques
}

export function CallStatus({ callId, onEndCall }: CallStatusProps) {
  const [status, setStatus] = useState('Connecting...');
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  const { lastMessage, sendMessage, isConnected } = useWebSocket(`wss://api.retellai.com/ws/llm/${callId}`);

  const fetchPostCallAnalysis = useCallback(async () => {
    try {
      const response = await fetch(`/api/retell/analysis/${callId}`);
      const data: AnalysisData = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error fetching post-call analysis:', error);
    }
  }, [callId]);

  useEffect(() => {
    if (lastMessage) {
      const message = lastMessage as WebSocketMessage;
      switch (message.type) {
        case 'status':
          setStatus(message.status || 'Unknown');
          break;
        case 'transcript':
          setTranscript(prev => prev + formatTranscript(message));
          break;
        case 'call_ended':
          setStatus('Call Ended');
          fetchPostCallAnalysis();
          break;
      }
    }
  }, [lastMessage, callId, fetchPostCallAnalysis]);

  const formatTranscript = (message: WebSocketMessage): string => {
    return `${message.speaker}: ${message.text}\n`;
  };

  const handleEndCall = () => {
    sendMessage(JSON.stringify({ type: 'end_call' }));
    onEndCall();
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Call Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>Status:</span>
            <Badge variant="outline">{status}</Badge>
          </div>
          <Button onClick={handleEndCall} disabled={!isConnected || status === 'Call Ended'}>
            End Call
          </Button>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Transcript</h4>
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
            {transcript || 'No transcript available yet.'}
          </pre>
        </div>
        {analysis && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Call Analysis</h4>
            <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
              {JSON.stringify(analysis, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
