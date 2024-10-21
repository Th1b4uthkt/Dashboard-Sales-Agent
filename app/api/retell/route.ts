import { NextResponse } from 'next/server';
import { retellClient } from '@/utils/retell-client';
import { transformAgentData, transformPhoneNumberData, transformLLMData } from '@/types/retell';

export async function GET() {
  try {
    const [agentsResponse, phoneNumbersResponse, llmsResponse] = await Promise.all([
      retellClient.get('/list-agents'),
      retellClient.get('/list-phone-numbers'),
      retellClient.get('/list-retell-llms')
    ]);

    const agents = agentsResponse.data.map(transformAgentData);
    const phoneNumbers = phoneNumbersResponse.data.map(transformPhoneNumberData);
    const llms = llmsResponse.data.map(transformLLMData);

    return NextResponse.json({ agents, phoneNumbers, llms });
  } catch (error) {
    console.error('Error fetching Retell data:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch Retell data', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'initiateCall':
        return await handleInitiateCall(data);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

interface CallInitiationData {
  agentId: string;
  fromNumber: string;
  toNumber: string;
  prospectData: Record<string, unknown>;
}

async function handleInitiateCall(data: CallInitiationData) {
  const { agentId, fromNumber, toNumber, prospectData } = data;
  
  try {
    const response = await retellClient.post('/v1/create-phone-call', {
      agent_id: agentId,
      from_number: fromNumber,
      to_number: toNumber,
      metadata: {
        prospectData: prospectData
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error initiating call:', error);
    return NextResponse.json({ error: 'Failed to initiate call' }, { status: 500 });
  }
}
