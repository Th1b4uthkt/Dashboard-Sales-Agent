import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Prospect } from '@/types/retell';

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('prospects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching prospects:', error);
    return NextResponse.json({ error: 'Failed to fetch prospects' }, { status: 500 });
  }

  return NextResponse.json(data as Prospect[]);
}