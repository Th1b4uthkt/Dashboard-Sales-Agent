import { Suspense } from 'react'
import ProspectsServer from './ProspectsServer'
import ProspectForm from '@/components/prospects/ProspectForm'
import { CSVImportModal } from '@/components/prospects/CSVImportModal'
import { Button } from "@/components/ui/button"
import { FileDown, Users } from 'lucide-react'

export default function ProspectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-white flex items-center">
          <Users className="mr-2 h-8 w-8" />
          Prospects Dashboard
        </h2>
        <div className="flex space-x-2">
          <CSVImportModal />
          <Button variant="secondary" className="hover:bg-white hover:text-blue-600 transition-colors">
            <FileDown className="mr-2 h-4 w-4" /> Export
          </Button>
          <ProspectForm />
        </div>
      </div>
      <Suspense fallback={<div className="text-center text-white">Loading prospects...</div>}>
        <ProspectsServer />
      </Suspense>
    </div>
  )
}
