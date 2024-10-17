'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import ProspectsList from './ProspectsList'

interface Prospect {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  status: string
  provider: string
}

export default function ProspectSearch({ initialProspects }: { initialProspects: Prospect[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search prospects..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ProspectsList prospects={initialProspects} searchTerm={searchTerm} />
    </div>
  )
}
