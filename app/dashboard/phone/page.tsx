'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Phone } from 'lucide-react'
import { CallList } from "@/components/phone/call-list"
import { Call } from '@/types/call'  // Assurez-vous d'importer le type Call

// Mock data for calls
const calls: Call[] = [
  { 
    id: '1', 
    type: 'incoming', 
    number: '+1234567890', 
    date: '2023-10-01 14:30', 
    duration: '5:23', 
    transcription: 'This is a sample transcription...', 
    status: 'ended'  // Ajout de la propriété status
  },
  { 
    id: '2', 
    type: 'outgoing', 
    number: '+9876543210', 
    date: '2023-09-30 10:15', 
    duration: '3:45', 
    transcription: 'Another sample transcription...', 
    status: 'ended'  // Ajout de la propriété status
  },
  // Add more mock calls...
]

export default function PhonePage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCalls = calls.filter(call =>
    call.number.includes(searchTerm) ||
    call.date.includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Phone</h2>
      
      <div className="flex justify-between items-center">
        <div className="relative w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search calls..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button>
          <Phone className="mr-2 h-4 w-4" />
          Initiate Call
        </Button>
      </div>

      <CallList calls={filteredCalls} />
    </div>
  )
}
