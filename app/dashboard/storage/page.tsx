'use client'

import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Search, FolderOpen } from 'lucide-react'
import { StorageModal } from '@/components/storage/StorageModal'
import { CategoryFileList } from '@/components/storage/CategoryFileList'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDebouncedCallback } from 'use-debounce'

interface FileEmbedding {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  category_id: number;
  created_at: string;
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

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchTerm(value);
  }, 300);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <FolderOpen className="mr-2 h-8 w-8" />
          Storage
        </h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              className="pl-8 w-64"
              value={searchTerm}
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>
          <StorageModal onUploadSuccess={fetchFiles} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        </div>
      ) : error ? (
        <Card className="bg-red-500/10">
          <CardContent className="text-red-500 p-4">{error}</CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Files</TabsTrigger>
            {categories.map((category, index) => (
              <TabsTrigger key={index} value={category.toLowerCase()}>{category}</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all">
            <Card className="bg-white/10">
              <CardContent className="p-6">
                {categories.map((categoryName, index) => (
                  <CategoryFileList
                    key={index}
                    categoryId={index + 1}
                    categoryName={categoryName}
                    files={filteredFiles.filter(file => file.category_id === index + 1)}
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          {categories.map((category, index) => (
            <TabsContent key={index} value={category.toLowerCase()}>
              <Card className="bg-white/10">
                <CardContent className="p-6">
                  <CategoryFileList
                    categoryId={index + 1}
                    categoryName={category}
                    files={filteredFiles.filter(file => file.category_id === index + 1)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}
