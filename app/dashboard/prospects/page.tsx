import { Suspense } from 'react'
import ProspectsServer from './ProspectsServer'
import ProspectForm from '@/components/prospects/ProspectForm'
import { CSVImportModal } from '@/components/prospects/CSVImportModal'
import { Button } from "@/components/ui/button"
import { FileDown } from 'lucide-react'

export default function ProspectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Prospects</h2>
        <div className="flex space-x-2">
          <CSVImportModal />
          <Button variant="outline"><FileDown className="mr-2 h-4 w-4" /> Export</Button>
          <ProspectForm />
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProspectsServer />
      </Suspense>
    </div>
  )
}
