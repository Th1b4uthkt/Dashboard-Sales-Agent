'use client'

import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { StorageModal } from '@/components/storage/StorageModal'
import { createClient } from '@/utils/supabase/client'

interface FileEmbedding {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
}

export default function StoragePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [files, setFiles] = useState<FileEmbedding[]>([])

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('file_embeddings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching files:', error);
    } else {
      setFiles(data || []);
    }
  };

  const filteredFiles = files.filter(file =>
    file.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Storage</h2>
      
      <div className="flex justify-between items-center">
        <div className="relative w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <StorageModal />
      </div>

      <div className="bg-white/10 rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-4">Uploaded TXT Files</h3>
        {filteredFiles.length > 0 ? (
          <ul className="space-y-2">
            {filteredFiles.map((file) => (
              <li key={file.id} className="flex justify-between items-center">
                <span>{file.file_name}</span>
                <span>{new Date(file.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>
    </div>
  )
}
