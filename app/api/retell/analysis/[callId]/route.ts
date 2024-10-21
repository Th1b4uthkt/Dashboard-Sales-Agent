import { NextResponse } from 'next/server';
import { retellClient } from '@/utils/retell-client';

export async function GET(
  request: Request,
  { params }: { params: { callId: string } }
) {
  const callId = params.callId;

  try {
    const response = await retellClient.get(`/get-call-analysis/${callId}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching call analysis:', error);
    return NextResponse.json({ error: 'Failed to fetch call analysis' }, { status: 500 });
  }
}