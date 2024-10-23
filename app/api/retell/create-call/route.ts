import { NextResponse } from 'next/server';
import Retell from 'retell-sdk';

if (!process.env.RETELL_API_KEY) {
  throw new Error('RETELL_API_KEY is not defined in the environment variables');
}

const client = new Retell({
  apiKey: process.env.RETELL_API_KEY as string,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { from_number, to_number, metadata } = body;

    const phoneCallResponse = await client.call.createPhoneCall({
      from_number,
      to_number,
      metadata,
    });

    return NextResponse.json(phoneCallResponse);
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json({ error: 'Failed to create call' }, { status: 500 });
  }
}
