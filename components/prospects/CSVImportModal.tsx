'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUp } from 'lucide-react'
import { importProspects } from '@/app/actions/prospects'
import { useToast } from "@/hooks/use-toast"

export function CSVImportModal() {
  const [file, setFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    console.log('Selected file:', selectedFile)
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
      console.log('File set:', selectedFile.name)
    } else {
      console.log('Invalid file type')
      toast({
        title: "Invalid file type",
        description: "Please select a valid CSV file",
        variant: "destructive",
      })
    }
  }

  const handleImport = async () => {
    if (!file) return
    console.log('Starting import process')
    setIsImporting(true)
    const formData = new FormData()
    formData.append('file', file)
    console.log('FormData created with file:', file.name)

    try {
      console.log('Calling importProspects')
      const result = await importProspects(formData)
      console.log('Import result:', result)
      if (result.success) {
        console.log('Import successful')
        toast({
          title: "Import successful",
          description: result.message,
        })
      } else {
        console.error('Import failed:', result.error)
        toast({
          title: "Import failed",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Import error:', error)
      toast({
        title: "Import error",
        description: "An unexpected error occurred during import",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
      console.log('Import process finished')
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><FileUp className="mr-2 h-4 w-4" /> Import</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Prospects from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing prospect information. The file should include columns for first name, last name, and email.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="csv-file" className="text-right">CSV File</Label>
            <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} className="col-span-3" />
          </div>
          <Button onClick={handleImport} disabled={!file || isImporting}>
            {isImporting ? 'Importing...' : 'Import'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
