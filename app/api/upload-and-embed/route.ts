import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Embeddings } from '@/lib/embeddings';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  try {
    // Upload file to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('txt_files')
      .upload(`${Date.now()}_${file.name}`, file);

    if (storageError) {
      throw new Error(storageError.message);
    }

    // Get file content
    const fileContent = await file.text();

    // Generate embedding
    const embedding = await Embeddings.generateEmbedding(fileContent);

    // Store file metadata and embedding in the database
    const { data: dbData, error: dbError } = await supabase
      .from('file_embeddings')
      .insert({
        file_name: file.name,
        file_path: storageData.path,
        embedding: embedding,
        user_id: (await supabase.auth.getUser()).data.user?.id
      });

    if (dbError) {
      throw new Error(dbError.message);
    }

    // Match documents using the RPC function
    const { data: documents } = await supabase.rpc('match_documents', {
      query_embedding: embedding, // Pass the embedding you want to compare
      match_threshold: 0.78, // Choose an appropriate threshold for your data
      match_count: 10, // Choose the number of matches
    });

    return NextResponse.json({ success: true, data: dbData, documents });
  } catch (error) {
    console.error('Error in upload and embed:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unexpected error occurred' }, { status: 500 });
  }
}
