'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentList } from '@/components/retell/agent-list';
import { PhoneNumberList } from '@/components/retell/phone-number-list';
import { CallInitiator } from '@/components/retell/call-initiator';
import { LLMList } from '@/components/retell/llm-list';
import { CallStatus } from '@/components/retell/call-status';

// Interfaces pour les données brutes
interface RawAgent {
  agent_id: string;
  agent_name: string;
  llm_websocket_url: string;
}

interface RawPhoneNumber {
  id?: string;
  number?: string;
  status?: string;
}

interface RawLLM {
  llm_id: string;
  model: string;
}

interface RawData {
  agents: RawAgent[];
  phoneNumbers: RawPhoneNumber[];
  llms: RawLLM[];
}

// Interfaces pour les données transformées
interface Agent {
  id: string;
  name: string;
  llm_id: string;
}

interface PhoneNumber {
  id: string;
  number: string;
  status: string;
}

interface LLM {
  id: string;
  name: string;
  provider: string;
}

// Fonction pour transformer les données
const transformData = (data: RawData) => {
  const agents: Agent[] = data.agents.map((agent) => ({
    id: agent.agent_id,
    name: agent.agent_name,
    llm_id: agent.llm_websocket_url.split('/').pop() || '',
  }));

  const phoneNumbers: PhoneNumber[] = data.phoneNumbers.map((phone) => ({
    id: phone.id || '',
    number: phone.number || '',
    status: phone.status || 'unknown',
  }));

  const llms: LLM[] = data.llms.map((llm) => ({
    id: llm.llm_id,
    name: llm.model,
    provider: llm.model.split('-')[0] || 'unknown',
  }));

  return { agents, phoneNumbers, llms };
};

export default function RetellPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [llms, setLLMs] = useState<LLM[]>([]);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/retell');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawData = await response.json();
        console.log('Raw fetched data:', rawData);  // Ajoutez ce log
        const transformedData = transformData(rawData);
        console.log('Transformed data:', transformedData);  // Et celui-ci
        setAgents(transformedData.agents);
        setPhoneNumbers(transformedData.phoneNumbers);
        setLLMs(transformedData.llms);
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
          <CallInitiator agents={agents} phoneNumbers={phoneNumbers} onCallInitiated={handleCallInitiated} />
          {activeCallId && <CallStatus callId={activeCallId} />}
        </div>
      </div>
    </div>
  );
}
