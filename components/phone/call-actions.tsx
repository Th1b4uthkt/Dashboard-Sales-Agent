import React from 'react'
import { Button } from "@/components/ui/button"
import { Mic, PhoneOff, UserPlus } from 'lucide-react'
import { Call } from '@/types/call'

interface CallActionsProps {
  call: Call;
}

export function CallActions({ call }: CallActionsProps) {
  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="icon" disabled={call.status === 'ended'}>
        <Mic className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" disabled={call.status === 'ended'}>
        <UserPlus className="h-4 w-4" />
      </Button>
      <Button variant="destructive" size="icon" disabled={call.status === 'ended'}>
        <PhoneOff className="h-4 w-4" />
      </Button>
    </div>
  )
}
