'use client'

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload } from 'lucide-react';

interface StorageModalProps {
  onUploadSuccess: () => Promise<void>;
}

export function StorageModal({ onUploadSuccess }: StorageModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState<number>(1);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && (selectedFile.type === 'text/plain' || selectedFile.type === 'application/pdf')) {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a valid TXT or PDF file",
        variant: "destructive",
      });
    }
  };

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
        onUploadSuccess(); // Ajoutez cette ligne
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
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button><Upload className="mr-2 h-4 w-4" /> Upload File</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload TXT or PDF File</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input type="file" accept=".txt,.pdf" onChange={handleFileChange} disabled={isUploading} />
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
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? 'Uploading...' : 'Upload and Embed'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
