// components/calendar/AddEventDialog.tsx
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from 'lucide-react'
import { CalendarEvent } from '@/types/calendar'
import { EventForm } from './EventForm'

interface AddEventDialogProps {
  onAddEvent: (event: CalendarEvent) => Promise<void>
  selectedDate: Date
}

export function AddEventDialog({ onAddEvent, selectedDate }: AddEventDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button><Plus className="mr-2 h-4 w-4" /> Add Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
        </DialogHeader>
        <EventForm 
          event={{
            id: '',
            title: '',
            description: '',
            startTime: selectedDate,
            endTime: selectedDate,
            participants: [],
            type: 'appointment'
          }} 
          onSubmit={onAddEvent} 
        />
      </DialogContent>
    </Dialog>
  )
}