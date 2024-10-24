import { NextResponse } from 'next/server';
import Retell from 'retell-sdk';

if (!process.env.RETELL_API_KEY) {
  throw new Error('RETELL_API_KEY is not defined in the environment variables');
}

const client = new Retell({
  apiKey: process.env.RETELL_API_KEY as string,
});

interface ErrorWithResponse extends Error {
  response?: {
    data?: unknown;
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { from_number, to_number, metadata, override_agent_id } = body;

    if (!from_number || !to_number) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    console.log('Creating call with params:', { from_number, to_number, metadata, override_agent_id });

    const phoneCallResponse = await client.call.createPhoneCall({
      from_number,
      to_number,
      metadata,
      override_agent_id,
    });

    console.log('Call created successfully:', phoneCallResponse);

    return NextResponse.json(phoneCallResponse);
  } catch (error: unknown) {
    console.error('Detailed error:', error);
    return NextResponse.json({ 
      error: 'Failed to create call', 
      message: error instanceof Error ? error.message : String(error),
      details: error instanceof Error && 'response' in error 
        ? (error as ErrorWithResponse).response?.data 
        : undefined
    }, { status: 500 });
  }
}
