// components/calendar/EventForm.tsx
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarEvent } from '@/types/calendar'

interface EventFormProps {
  event: Partial<CalendarEvent>
  onSubmit: (event: CalendarEvent) => Promise<void>
}

export function EventForm({ event, onSubmit }: EventFormProps) {
  const [formData, setFormData] = useState(event)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData as CalendarEvent)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input 
        value={formData.title} 
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        placeholder="Event Title" 
      />
      <Textarea 
        value={formData.description} 
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        placeholder="Event Description" 
      />
      <Input 
        type="datetime-local" 
        value={formData.startTime ? new Date(formData.startTime).toISOString().slice(0, 16) : ''} 
        onChange={(e) => setFormData({...formData, startTime: new Date(e.target.value)})}
      />
      <Input 
        type="datetime-local" 
        value={formData.endTime ? new Date(formData.endTime).toISOString().slice(0, 16) : ''} 
        onChange={(e) => setFormData({...formData, endTime: new Date(e.target.value)})}
      />
      <Input 
        value={formData.participants ? formData.participants.join(', ') : ''} 
        onChange={(e) => setFormData({...formData, participants: e.target.value.split(',')})}
        placeholder="Participants (comma-separated)" 
      />
      <Select 
        value={formData.type} 
        onValueChange={(value) => setFormData({...formData, type: value as 'appointment' | 'call' | 'task'})}
      >
        <SelectTrigger>
          <SelectValue placeholder="Event Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="appointment">Appointment</SelectItem>
          <SelectItem value="call">Call</SelectItem>
          <SelectItem value="task">Task</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit">Save Event</Button>
    </form>
  )
}