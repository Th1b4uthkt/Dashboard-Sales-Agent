import { NextResponse } from 'next/server';
import axios from 'axios';

const retellClient = axios.create({
  baseURL: 'https://api.retellai.com',
  headers: {
    'Authorization': `Bearer ${process.env.RETELL_API_KEY}`
  }
});

export async function GET() {
  try {
    const response = await retellClient.get('/list-agents');
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}
