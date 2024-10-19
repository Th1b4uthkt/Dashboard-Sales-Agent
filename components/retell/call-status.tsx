'use client';

import { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/use-websocket';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CallStatusProps {
  callId: string;
}

export function CallStatus({ callId }: CallStatusProps) {
  const [status, setStatus] = useState('Connecting...');
  const [transcript, setTranscript] = useState('');

  const { lastMessage } = useWebSocket(`wss://api.retellai.com/ws/llm/${callId}`);

  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data);
      if (data.type === 'status') {
        setStatus(data.status);
      } else if (data.type === 'transcript') {
        setTranscript(prev => prev + data.text);
      }
    }
  }, [lastMessage]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Call Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <span>Status:</span>
          <Badge variant="outline">{status}</Badge>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Transcript</h4>
          <p className="text-sm text-muted-foreground">{transcript || 'No transcript available yet.'}</p>
        </div>
      </CardContent>
    </Card>
  );
}
