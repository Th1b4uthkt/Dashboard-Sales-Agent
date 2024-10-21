'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentList } from '@/components/retell/agent-list';
import { PhoneNumberList } from '@/components/retell/phone-number-list';
import { CallInitiator } from '@/components/retell/call-initiator';
import { LLMList } from '@/components/retell/llm-list';
import { CallStatus } from '@/components/retell/call-status';
import { Agent, PhoneNumber, LLM, Prospect } from '@/types/retell';

export default function RetellPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [llms, setLLMs] = useState<LLM[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [retellResponse, prospectsResponse] = await Promise.all([
          fetch('/api/retell'),
          fetch('/api/prospects')
        ]);

        if (!retellResponse.ok || !prospectsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const retellData = await retellResponse.json();
        const prospectsData = await prospectsResponse.json();

        setAgents(retellData.agents);
        setPhoneNumbers(retellData.phoneNumbers);
        setLLMs(retellData.llms);
        setProspects(prospectsData);
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
    // Optionally, you can refresh the call list or perform other actions here
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="phoneNumbers">Phone Numbers</TabsTrigger>
              <TabsTrigger value="llms">LLMs</TabsTrigger>
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
          </Tabs>
        </div>
        <div>
          <CallInitiator 
            agents={agents} 
            phoneNumbers={phoneNumbers} 
            prospects={prospects}
            onCallInitiated={handleCallInitiated} 
          />
          {activeCallId && <CallStatus callId={activeCallId} onEndCall={handleCallEnded} />}
        </div>
      </div>
    </div>
  );
}
