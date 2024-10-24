'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CallStatusProps {
  callId: string;
  onEndCall: () => void;
}

interface TranscriptUpdate {
  role: string;
  content: string;
}

interface ResponseRequired {
  prompt: string;
}

export function CallStatus({ callId, onEndCall }: CallStatusProps) {
  const [status, setStatus] = useState('Initializing...');
  const [transcript, setTranscript] = useState<string[]>([]);
  const [llmResponse, setLlmResponse] = useState<string>('');
  const [analysis, setAnalysis] = useState<string>('');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const handleTranscriptUpdate = useCallback((update: TranscriptUpdate) => {
    setTranscript(prev => [...prev, `${update.role}: ${update.content}`]);
  }, []);

  const handleResponseRequired = useCallback((data: ResponseRequired) => {
    setLlmResponse(data.prompt);
  }, []);

  useEffect(() => {
    const newSocket = new WebSocket(`wss://your-websocket-url/${callId}`);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [callId]);

  useEffect(() => {
    if (socket) {
      socket.onopen = () => {
        setStatus('Connected');
        // Send initial config event
        socket.send(JSON.stringify({
          response_type: 'config',
          config: {
            auto_reconnect: true,
            call_details: true,
            transcript_with_tool_calls: true
          }
        }));

        // Send initial response event
        socket.send(JSON.stringify({
          response_type: 'response',
          response_id: 0,
          content: 'Hello, how can I assist you today?',
          content_complete: true
        }));
      };

      socket.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        switch (data.interaction_type) {
          case 'ping_pong':
            socket.send(JSON.stringify({
              response_type: 'ping_pong',
              timestamp: Date.now()
            }));
            break;
          case 'call_details':
            console.log('Call details:', data.call);
            break;
          case 'update_only':
            handleTranscriptUpdate(data);
            break;
          case 'response_required':
          case 'reminder_required':
            handleResponseRequired(data);
            break;
          case 'call_ended':
            setStatus('Call Ended');
            setAnalysis(JSON.stringify(data.analysis, null, 2));
            break;
        }
      };

      socket.onclose = () => {
        setStatus('Disconnected');
        setSocket(null);
      };

      socket.onerror = (event: Event) => {
        console.error('WebSocket error:', event);
        setStatus('Error');
      };
    }
  }, [socket, handleResponseRequired, handleTranscriptUpdate, callId]);

  const handleEndCall = () => {
    if (socket) {
      socket.send(JSON.stringify({ type: 'end_call' }));
    }
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
          <Button onClick={handleEndCall} disabled={status === 'Call Ended'}>
            End Call
          </Button>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Transcript</h4>
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
            {transcript.join('\n') || 'No transcript available yet.'}
          </pre>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">LLM Response</h4>
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
            {llmResponse || 'No LLM response yet.'}
          </pre>
        </div>
        {analysis && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Call Analysis</h4>
            <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
              {analysis}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
