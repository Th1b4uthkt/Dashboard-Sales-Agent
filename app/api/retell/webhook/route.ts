import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = createClient();

  try {
    switch (body.event_type) {
      case 'call_started':
        await supabase
          .from('calls')
          .update({ status: 'active' })
          .eq('call_id', body.call_id);
        break;
      case 'call_ended':
        await supabase
          .from('calls')
          .update({ status: 'ended', duration: body.duration })
          .eq('call_id', body.call_id);
        break;
      case 'transcription_completed':
        await supabase
          .from('calls')
          .update({ transcription: body.transcription })
          .eq('call_id', body.call_id);
        break;
      // Add more cases as needed
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}
