import { NextResponse } from 'next/server';
import Retell from 'retell-sdk';

// Interfaces pour les réponses de l'API
interface PhoneNumberResponse {
  phone_number: string;
  phone_number_pretty: string;
  inbound_agent_id: string | null;
  outbound_agent_id: string | null;
  area_code: number;
  nickname: string | null;
  last_modification_timestamp: number;
}

interface AgentResponse {
  agent_id: string;
  agent_name?: string | null;
  llm_websocket_url: string;
}

interface LLMResponse {
  llm_id: string;
  model?: string;
}

type PhoneNumberListResponse = PhoneNumberResponse[];
type AgentListResponse = AgentResponse[];
type LLMListResponse = LLMResponse[];

// Interfaces pour les données transformées
interface RetellAgent {
  agent_id: string;
  agent_name: string;
  llm_websocket_url: string;
}

interface RetellPhoneNumber {
  phone_number: string;
  phone_number_pretty: string;
  inbound_agent_id: string | null;
  outbound_agent_id: string | null;
  area_code: number;
  nickname: string | null;
  last_modification_timestamp: number;
}

interface RetellLLM {
  llm_id: string;
  model: string;
}

// Fonctions de transformation
const transformAgents = (agents: AgentListResponse): RetellAgent[] => {
  return agents.map((agent) => ({
    agent_id: agent.agent_id,
    agent_name: agent.agent_name || '',
    llm_websocket_url: agent.llm_websocket_url,
  }));
};

const transformPhoneNumbers = (phoneNumbers: PhoneNumberListResponse): RetellPhoneNumber[] => {
  return phoneNumbers.map((phone) => ({
    ...phone
  }));
};

const transformLLMs = (llms: LLMListResponse): RetellLLM[] => {
  return llms.map((llm) => ({
    llm_id: llm.llm_id,
    model: llm.model || '',
  }));
};

const client = new Retell({
  apiKey: process.env.RETELL_API_KEY || '',
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'getPhoneNumbers':
        const phoneNumbersListResponse = await client.phoneNumber.list() as PhoneNumberListResponse;
        const phoneNumbersList = transformPhoneNumbers(phoneNumbersListResponse);
        return NextResponse.json({ phoneNumbers: phoneNumbersList });
      
      default:
        const [agentsResponse, phoneNumbersResponse, llmsResponse] = await Promise.all([
          client.agent.list() as Promise<AgentListResponse>,
          client.phoneNumber.list() as Promise<PhoneNumberListResponse>,
          client.llm.list() as Promise<LLMListResponse>
        ]);

        const agents = transformAgents(agentsResponse);
        const phoneNumbers = transformPhoneNumbers(phoneNumbersResponse);
        const llms = transformLLMs(llmsResponse);

        return NextResponse.json({ agents, phoneNumbers, llms });
    }
  } catch (error) {
    console.error('Error fetching Retell data:', error);
    return NextResponse.json({ error: 'Failed to fetch Retell data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RETELL_API_KEY;
    if (!apiKey) {
      throw new Error('RETELL_API_KEY is not set');
    }

    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'initiateCall':
        const { agentId, phoneNumberId } = data;
        const response = await fetch('https://api.retellai.com/v2/create-phone-call', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            override_agent_id: agentId,
            phone_number_id: phoneNumberId,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const callData = await response.json();
        return NextResponse.json(callData);

      default:
        const { from_number, to_number, override_agent_id, metadata, retell_llm_dynamic_variables } = data;
        const defaultResponse = await fetch('https://api.retellai.com/v2/create-phone-call', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from_number,
            to_number,
            override_agent_id,
            metadata,
            retell_llm_dynamic_variables,
          }),
        });

        if (!defaultResponse.ok) {
          throw new Error(`HTTP error! status: ${defaultResponse.status}`);
        }

        const defaultData = await defaultResponse.json();
        return NextResponse.json(defaultData);
    }
  } catch (error) {
    console.error('Error processing Retell request:', error);
    return NextResponse.json({ error: 'Failed to process Retell request' }, { status: 500 });
  }
}
