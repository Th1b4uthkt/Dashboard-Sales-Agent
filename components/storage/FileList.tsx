'use client'

import React, { useState, useEffect } from 'react';
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { createClient } from '@/utils/supabase/client';

interface File {
  id: string;
  name: string;
  type: string;
  size: number;
  created_at: string;
}

export function FileList() {
  const [files, setFiles] = useState<File[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;

  const fetchFiles = React.useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .range((page - 1) * pageSize, page * pageSize - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching files:', error);
    } else {
      setFiles(data || []);
    }
    setIsLoading(false);
  }, [page, pageSize]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          {/* Table content */}
        </Table>
      )}
      <div className="flex justify-between mt-4">
        <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          Previous
        </Button>
        <Button onClick={() => setPage(p => p + 1)} disabled={files.length < pageSize}>
          Next
        </Button>
      </div>
    </div>
  );
}
