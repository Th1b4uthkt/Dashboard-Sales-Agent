'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentList } from '@/components/retell/agent-list';
import { PhoneNumberList } from '@/components/retell/phone-number-list';
import { UnifiedCallInitiator } from '@/components/retell/unified-call-initiator';
import { LLMList } from '@/components/retell/llm-list';
import { CallStatus } from '@/components/retell/call-status';
import { CallHistoryList } from '@/components/retell/call-history-list';
import { Agent, PhoneNumber, LLM, Prospect, Call, RawCall, transformCallData } from '@/types/retell';

export default function RetellPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [llms, setLLMs] = useState<LLM[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [retellResponse, prospectsResponse, callsResponse] = await Promise.all([
          fetch('/api/retell'),
          fetch('/api/prospects'),
          fetch('/api/retell/calls')
        ]);

        if (!retellResponse.ok || !prospectsResponse.ok || !callsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const retellData = await retellResponse.json();
        const prospectsData = await prospectsResponse.json();
        const rawCallsData: RawCall[] = await callsResponse.json();

        setAgents(retellData.agents);
        setPhoneNumbers(retellData.phoneNumbers);
        setLLMs(retellData.llms);
        setProspects(prospectsData);
        setCalls(rawCallsData.map(transformCallData));
      } catch (err) {
        setError('Failed to fetch data: ' + (err instanceof Error ? err.message : String(err)));
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCallInitiated = (callId: string) => {
    setActiveCallId(callId);
  };

  const handleCallEnded = () => {
    setActiveCallId(null);
    // Optionally, refresh the call list here
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-primary">Retell Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="agents">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="phoneNumbers">Phone Numbers</TabsTrigger>
              <TabsTrigger value="llms">LLMs</TabsTrigger>
              <TabsTrigger value="callHistory">Call History</TabsTrigger>
            </TabsList>
            <TabsContent value="agents">
              <AgentList agents={agents} />
            </TabsContent>
            <TabsContent value="phoneNumbers">
              <PhoneNumberList phoneNumbers={phoneNumbers} />
            </TabsContent>
            <TabsContent value="llms">
              <LLMList llms={llms} />
            </TabsContent>
            <TabsContent value="callHistory">
              <CallHistoryList calls={calls} />
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <div className="space-y-4">
            <UnifiedCallInitiator
              agents={agents}
              phoneNumbers={phoneNumbers}
              prospects={prospects}
              onCallInitiated={handleCallInitiated}
            />
            {activeCallId && <CallStatus callId={activeCallId} onEndCall={handleCallEnded} />}
          </div>
        </div>
      </div>
    </div>
  );
}
