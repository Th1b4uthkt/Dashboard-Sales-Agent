import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Retell } from 'retell-sdk';

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = createClient();
  const signature = request.headers.get('x-retell-signature') || '';
  const apiKey = process.env.RETELL_API_KEY;

  if (!apiKey) {
    console.error('Retell API key is not defined');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  if (!Retell.verify(JSON.stringify(body), apiKey, signature)) {
    console.error('Invalid signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const { event, call } = body;

  try {
    switch (event) {
      case 'call_started':
        await supabase
          .from('calls')
          .update({ status: 'active' })
          .eq('call_id', call.call_id);
        break;
      case 'call_ended':
        await supabase
          .from('calls')
          .update({ status: 'ended', duration: call.end_timestamp - call.start_timestamp })
          .eq('call_id', call.call_id);
        break;
      case 'call_analyzed':
        await supabase
          .from('calls')
          .update({ analysis: call.call_analysis })
          .eq('call_id', call.call_id);
        break;
      default:
        console.log('Received an unknown event:', event);
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}
