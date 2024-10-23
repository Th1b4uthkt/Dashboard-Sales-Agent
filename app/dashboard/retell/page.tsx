'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RetellCallInitiator } from '@/components/retell/RetellCallInitiator';
import { ProspectCallInitiator } from '@/components/retell/ProspectCallInitiator';
import { CallStatus } from '@/components/retell/call-status';

export default function RetellPage() {
  const [activeCallId, setActiveCallId] = useState<string | null>(null);

  const handleCallInitiated = (callId: string) => {
    setActiveCallId(callId);
  };

  const handleCallEnded = () => {
    setActiveCallId(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-primary">Retell Dashboard</h1>
      <Tabs defaultValue="simple">
        <TabsList>
          <TabsTrigger value="simple">Simple Call</TabsTrigger>
          <TabsTrigger value="prospect">Call Prospect</TabsTrigger>
        </TabsList>
        <TabsContent value="simple">
          <RetellCallInitiator onCallInitiated={handleCallInitiated} />
        </TabsContent>
        <TabsContent value="prospect">
          <ProspectCallInitiator onCallInitiated={handleCallInitiated} />
        </TabsContent>
      </Tabs>
      {activeCallId && <CallStatus callId={activeCallId} onEndCall={handleCallEnded} />}
    </div>
  );
}
