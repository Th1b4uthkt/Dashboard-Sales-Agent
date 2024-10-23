import { NextResponse } from 'next/server';
import Retell from 'retell-sdk';

if (!process.env.RETELL_API_KEY) {
  throw new Error('RETELL_API_KEY is not defined in the environment variables');
}

const client = new Retell({
  apiKey: process.env.RETELL_API_KEY as string,
});

export async function GET() {
  try {
    const phoneNumberResponses = await client.phoneNumber.list();
    return NextResponse.json(phoneNumberResponses);
  } catch (error) {
    console.error('Error fetching phone numbers:', error);
    return NextResponse.json({ error: 'Failed to fetch phone numbers' }, { status: 500 });
  }
}
