import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileIcon, FileTextIcon, Download, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileEmbedding {
  id: string;
  file_name: string;
  file_type: string;
  created_at: string;
  // Add other fields as necessary
}

interface CategoryFileListProps {
  categoryId: number;
  categoryName: string;
  files: FileEmbedding[];
}

export function CategoryFileList({ 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  categoryId, 
  categoryName, 
  files 
}: CategoryFileListProps) {
  // categoryId is used for filtering files in the parent component
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

  return (
    <div className="bg-white/10 rounded-lg p-4">
      <h3 className="text-xl font-semibold mb-4">{categoryName}</h3>
      {files.length > 0 ? (
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
            {files.map((file, index) => (
              <motion.tr
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <TableCell>{getFileIcon(file.file_type)}</TableCell>
                <TableCell>{file.file_name}</TableCell>
                <TableCell>{new Date(file.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleDownload(file)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-muted-foreground">No files in this category.</p>
      )}
    </div>
  );
}

async function handleDownload(file: FileEmbedding) {
  // Implement download logic here
  console.log(`Downloading file: ${file.file_name}`);
  // You would typically call an API endpoint to initiate the download
}
