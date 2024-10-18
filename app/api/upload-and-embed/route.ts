import '../../polyfills';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Embeddings } from '@/lib/embeddings';
import PDFParser from 'pdf2json';

// Supprimez ou commentez la ligne suivante :
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const category = formData.get('category') as string;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  if (!category) {
    return NextResponse.json({ error: 'No category specified' }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const extractTextFromPDF = (pdfBuffer: Buffer): Promise<string> => {
      return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, true);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdfParser.on('pdfParser_dataError', (errData: any) => reject(errData.parserError));
        pdfParser.on('pdfParser_dataReady', () => {
          const text = pdfParser.getRawTextContent();
          resolve(text);
        });

        pdfParser.parseBuffer(pdfBuffer);
      });
    };

    const fullText = await extractTextFromPDF(buffer);
    const cleanedContent = cleanText(fullText);

    // Upload file to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('files')
      .upload(`${Date.now()}_${file.name}`, file);

    if (storageError) {
      throw new Error(storageError.message);
    }

    // Generate embedding
    const embedding = await Embeddings.generateEmbedding(cleanedContent);

    // Store file metadata and embedding in the database
    const { data: dbData, error: dbError } = await supabase
      .from('file_embeddings')
      .insert({
        file_name: file.name,
        file_path: storageData.path,
        file_type: file.type,
        embedding: embedding,
        content: cleanedContent,
        category_id: parseInt(category),
        user_id: (await supabase.auth.getUser()).data.user?.id
      });

    if (dbError) {
      throw new Error(dbError.message);
    }

    return NextResponse.json({ success: true, data: dbData });
  } catch (error) {
    console.error('Error in upload and embed:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unexpected error occurred' }, { status: 500 });
  }
}

function cleanText(text: string): string {
  return text.trim()
    .replace(/\s+/g, ' ')
    .replace(/\f/g, '\n')
    .replace(/[^\x20-\x7E\n]/g, '');
}
