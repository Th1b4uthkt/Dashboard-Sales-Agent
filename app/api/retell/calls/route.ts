import { NextResponse } from 'next/server';
import { retellClient } from '@/utils/retell-client';

export async function GET() {
  try {
    const response = await retellClient.get('/list-calls');
    if (response && typeof response === 'object' && 'data' in response) {
      return NextResponse.json(response.data);
    } else {
      throw new Error('Unexpected response structure');
    }
  } catch (error) {
    console.error('Error fetching calls:', error);
    return NextResponse.json({ error: 'Failed to fetch calls' }, { status: 500 });
  }
}
