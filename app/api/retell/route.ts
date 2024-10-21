import { NextResponse } from 'next/server';
import { retellClient } from '@/utils/retell-client';
import { Agent, PhoneNumber, LLM } from '@/types/retell';

interface RawAgent {
  agent_id: string;
  agent_name?: string;
  llm_websocket_url: string;
  voice_id: string;
  llm_id?: string;
}

interface RawPhoneNumber {
  phone_number: string;
  phone_number_pretty?: string;
  inbound_agent_id?: string;
  outbound_agent_id?: string;
  nickname?: string;
}

interface RawLLM {
  llm_id: string;
  model?: string;
}

function transformAgent(agent: RawAgent): Agent {
  return {
    id: agent.agent_id,
    name: agent.agent_name || 'Unnamed Agent',
    llm_websocket_url: agent.llm_websocket_url,
    voice_id: agent.voice_id,
    llm_id: agent.llm_id || agent.llm_websocket_url.split('/').pop() || '',
  };
}

function transformPhoneNumber(phone: RawPhoneNumber): PhoneNumber {
  return {
    id: phone.phone_number,
    number: phone.phone_number_pretty || phone.phone_number,
    status: phone.inbound_agent_id ? 'active' : 'inactive',
    nickname: phone.nickname || '',
    agentId: phone.inbound_agent_id || phone.outbound_agent_id || '',
  };
}

function transformLLM(llm: RawLLM): LLM {
  return {
    id: llm.llm_id,
    name: llm.model || 'Unknown Model',
    provider: llm.model?.split('-')[0] || 'unknown',
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'getPhoneNumbers':
        const phoneNumbersResponse = await retellClient.get('/list-phone-numbers');
        const phoneNumbers: PhoneNumber[] = phoneNumbersResponse.data.map(transformPhoneNumber);
        return NextResponse.json({ phoneNumbers });
      
      case 'getAgents':
        const agentsResponse = await retellClient.get('/list-agents');
        const agents: Agent[] = agentsResponse.data.map(transformAgent);
        return NextResponse.json({ agents });

      case 'getLLMs':
        const llmsResponse = await retellClient.get('/list-retell-llms');
        const llms: LLM[] = llmsResponse.data.map(transformLLM);
        return NextResponse.json({ llms });
      
      default:
        const [allAgentsResponse, allPhoneNumbersResponse, allLLMsResponse] = await Promise.all([
          retellClient.get('/list-agents'),
          retellClient.get('/list-phone-numbers'),
          retellClient.get('/list-retell-llms')
        ]);

        const allAgents: Agent[] = allAgentsResponse.data.map(transformAgent);
        const allPhoneNumbers: PhoneNumber[] = allPhoneNumbersResponse.data.map(transformPhoneNumber);
        const allLLMs: LLM[] = allLLMsResponse.data.map(transformLLM);

        return NextResponse.json({ agents: allAgents, phoneNumbers: allPhoneNumbers, llms: allLLMs });
    }
  } catch (error) {
    console.error('Error fetching Retell data:', error);
    return NextResponse.json({ error: 'Failed to fetch Retell data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, ...data } = body;

  try {
    switch (action) {
      case 'initiateCall':
        const { agentId, fromNumber, toNumber } = data;
        const response = await retellClient.post('/create-phone-call', {
          agent_id: agentId,
          from_number: fromNumber,
          to_number: toNumber,
        });

        // Modifions cette partie pour accepter 201 comme un statut de succès
        if (response.status !== 200 && response.status !== 201) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return NextResponse.json(response.data);

      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error processing Retell request:', error);
    return NextResponse.json({ error: 'Failed to process Retell request' }, { status: 500 });
  }
}
