'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { createClient } from '@/utils/supabase/client';
import { FileIcon, FileTextIcon } from 'lucide-react';

interface File {
  id: string;
  file_name: string;
  file_type: string;
  created_at: string;
}

interface FileListProps {
  searchTerm: string;
}

export function FileList({ searchTerm }: FileListProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('file_embeddings')
      .select('*')
      .range((page - 1) * pageSize, page * pageSize - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching files:', error);
      setError('Failed to load files. Please try again.');
    } else {
      setFiles(data || []);
    }
    setIsLoading(false);
  }, [page, pageSize]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles, searchTerm]);

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'application/pdf':
        return <FileIcon className="h-5 w-5 text-red-500" />;
      case 'text/plain':
        return <FileTextIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredFiles = files.filter(file =>
    file.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {isLoading ? (
        <div>Loading files...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>Uploaded At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFiles.map((file) => (
              <TableRow key={file.id}>
                <TableCell>{getFileIcon(file.file_type)}</TableCell>
                <TableCell>{file.file_name}</TableCell>
                <TableCell>{new Date(file.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDownload(file)}>Download</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className="mt-4">
        <Button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</Button>
        <Button onClick={() => setPage(page + 1)} disabled={files.length < pageSize}>Next</Button>
      </div>
    </div>
  );
}

async function handleDownload(file: File) {
  // Implement download logic here
  console.log(`Downloading file: ${file.file_name}`);
  // You would typically call an API endpoint to initiate the download
}
