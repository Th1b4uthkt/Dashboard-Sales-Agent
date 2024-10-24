'use client';

import React, { useState } from 'react';
import { RetellCallInitiator } from '@/components/retell/RetellCallInitiator';
import { ProspectCallInitiator } from '@/components/retell/ProspectCallInitiator';
import { CallStatus } from '@/components/retell/call-status';

export default function RetellPage() {
  const [activeCallId, setActiveCallId] = useState<string | null>(null);

  const handleCallInitiated = (callId: string) => {
    console.log('Call initiated:', callId);
    setActiveCallId(callId);
    console.log('State updated:', { activeCallId: callId });
  };

  const handleCallEnded = () => {
    setActiveCallId(null);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-primary">Retell Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RetellCallInitiator onCallInitiated={handleCallInitiated} />
        <ProspectCallInitiator onCallInitiated={handleCallInitiated} />
      </div>
      {activeCallId && (
        <CallStatus 
          callId={activeCallId} 
          onEndCall={handleCallEnded} 
        />
      )}
    </div>
  );
}
