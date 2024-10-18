'use client'

import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { StorageModal } from '@/components/storage/StorageModal'
import { CategoryFileList } from '@/components/storage/CategoryFileList'
import { createClient } from '@/utils/supabase/client'

interface FileEmbedding {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  category_id: number;
  created_at: string;
  // Add other fields as necessary
}

export default function StoragePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [files, setFiles] = useState<FileEmbedding[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    console.log('Fetching files...');
    setIsLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('file_embeddings')
      .select('id, file_name, file_path, file_type, category_id, created_at')
      .order('created_at', { ascending: false });

    console.log('Fetch result:', { data, error });

    if (error) {
      console.error('Error fetching files:', error);
      setError('Failed to load files. Please try again.');
    } else {
      setFiles(data || []);
    }
    setIsLoading(false);
  };

  const filteredFiles = files.filter(file =>
    file.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = ['Knowledges', 'Script', 'Products', 'Context'];

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
        <StorageModal onUploadSuccess={fetchFiles} />
      </div>

      {isLoading ? (
        <div>Loading files...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="space-y-6">
          {categories.map((categoryName, index) => (
            <CategoryFileList
              key={index}
              categoryId={index + 1}
              categoryName={categoryName}
              files={filteredFiles.filter(file => file.category_id === index + 1)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
