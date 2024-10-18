'use client'

import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Progress } from "@/components/ui/progress";

interface StorageModalProps {
  onUploadSuccess: () => Promise<void>;
}

export function StorageModal({ onUploadSuccess }: StorageModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState<number>(1);
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'text/plain': ['.txt'], 'application/pdf': ['.pdf'] } });

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', categoryId.toString());

    try {
      const response = await fetch('/api/upload-and-embed', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        toast({
          title: "Upload successful",
          description: `${file.type === 'application/pdf' ? 'PDF' : 'TXT'} file uploaded and embedded successfully in ${categoryId} category`,
        });
        onUploadSuccess();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setFile(null);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button><Upload className="mr-2 h-4 w-4" /> Upload File</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload TXT or PDF File</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div {...getRootProps()} className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${isDragActive ? 'border-primary' : 'border-gray-300'}`}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the file here ...</p>
            ) : (
              <p>Drag &apos;n&apos; drop a file here, or click to select a file</p>
            )}
            {file && <p className="mt-2">{file.name}</p>}
          </div>
          <Select value={categoryId.toString()} onValueChange={(value) => setCategoryId(parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Knowledges</SelectItem>
              <SelectItem value="2">Script</SelectItem>
              <SelectItem value="3">Products</SelectItem>
              <SelectItem value="4">Context</SelectItem>
            </SelectContent>
          </Select>
          {uploadProgress > 0 && <Progress value={uploadProgress} className="w-full" />}
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? 'Uploading...' : 'Upload and Embed'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
