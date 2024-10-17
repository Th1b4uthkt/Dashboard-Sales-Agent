'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FolderPlus, Upload, Download, Trash2, BookOpen, Package, FileText, File } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

// StorageCategories component
function StorageCategories() {
  const categories = [
    { name: 'Knowledge', icon: BookOpen },
    { name: 'Products', icon: Package },
    { name: 'Scripts', icon: FileText },
    { name: 'Miscellaneous', icon: File },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Card key={category.name} className="bg-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
            <category.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">items</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// FileList component
function FileList() {
  const files = [
    { id: 1, name: 'Document.pdf', type: 'PDF', size: '2.5 MB', modified: '2023-10-15' },
    { id: 2, name: 'Image.jpg', type: 'Image', size: '1.8 MB', modified: '2023-10-14' },
    // Add more mock data as needed
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Modified</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <TableRow key={file.id}>
            <TableCell>
              <Checkbox />
            </TableCell>
            <TableCell>{file.name}</TableCell>
            <TableCell>{file.type}</TableCell>
            <TableCell>{file.size}</TableCell>
            <TableCell>{file.modified}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// Main StoragePage component
export default function StoragePage() {
  const [searchTerm, setSearchTerm] = useState('')

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
        <div className="space-x-2">
          <Button variant="outline">
            <FolderPlus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
        </div>
      </div>

      <StorageCategories />

      <FileList />
    </div>
  )
}
