'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWebSocket } from '@/hooks/use-websocket';

interface CallStatusProps {
  callId: string;
  onEndCall: () => void;
}

export function CallStatus({ callId, onEndCall }: CallStatusProps) {
  const [status, setStatus] = useState<string>('Connecting...');
  const [transcript, setTranscript] = useState<string[]>([]);
  const [llmResponse, setLlmResponse] = useState<string>('');
  const [analysis, setAnalysis] = useState<string>('');

  const { lastMessage, sendMessage, isConnected } = useWebSocket(`/api/retell/websocket/${callId}`);

  const handleTranscriptUpdate = useCallback((update: { role: string; content: string }) => {
    setTranscript(prev => [...prev, `${update.role}: ${update.content}`]);
  }, []);

  const handleResponseRequired = useCallback((data: { prompt: string; response_id: string }) => {
    setLlmResponse(data.prompt);
    // Here you would typically generate a response using your LLM
    // For this example, we'll just echo the prompt
    sendMessage({
      response_type: 'response',
      response_id: data.response_id,
      content: `Echo: ${data.prompt}`,
      content_complete: true
    });
  }, [sendMessage]);

  useEffect(() => {
    if (isConnected) {
      console.log('WebSocket connected');
      sendMessage({
        response_type: 'config',
        config: {
          auto_reconnect: true,
          call_details: true,
          transcript_with_tool_calls: true
        }
      });
    }
  }, [isConnected, sendMessage]);

  useEffect(() => {
    if (lastMessage) {
      console.log('Received message:', lastMessage);
      switch (lastMessage.interaction_type) {
        case 'ping_pong':
          sendMessage({
            response_type: 'ping_pong',
            timestamp: Date.now()
          });
          break;
        case 'call_details':
          console.log('Call details:', lastMessage.call);
          break;
        case 'update_only':
          handleTranscriptUpdate(lastMessage);
          break;
        case 'response_required':
        case 'reminder_required':
          handleResponseRequired(lastMessage);
          break;
        case 'call_ended':
          setStatus('Call Ended');
          setAnalysis(JSON.stringify(lastMessage.analysis, null, 2));
          break;
      }
    }
  }, [lastMessage, sendMessage, handleTranscriptUpdate, handleResponseRequired]);

  const handleEndCall = async () => {
    try {
      const response = await fetch(`/api/retell/end-call/${callId}`, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to end call');
      }
      sendMessage({ type: 'end_call' });
      onEndCall();
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Call Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <span>Status:</span>
          <Badge variant="outline">{status}</Badge>
          <Badge variant={isConnected ? "secondary" : "destructive"}>
            {isConnected ? "WebSocket Connected" : "WebSocket Disconnected"}
          </Badge>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Call ID: {callId}</h4>
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
        <Button onClick={handleEndCall}>End Call</Button>
      </CardContent>
    </Card>
  );
}
