'use client'

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from '@/utils/supabase/client';

export function StorageModal() {
  const [isUploading, setIsUploading] = useState(false);
  const [folderName, setFolderName] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log('File uploaded:', result);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName) return;
    const supabase = createClient();
    const { data, error } = await supabase.storage.from('files').upload(`${folderName}/.keep`, new Blob([]));
    if (error) {
      console.error('Folder creation error:', error);
    } else {
      console.log('Folder created:', data);
      setFolderName('');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Storage Actions</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Storage Actions</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="mb-2">Upload File</h3>
            <Input type="file" onChange={handleFileUpload} disabled={isUploading} />
          </div>
          <div>
            <h3 className="mb-2">Create Folder</h3>
            <Input
              type="text"
              placeholder="Folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
            <Button onClick={handleCreateFolder} className="mt-2">Create Folder</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
