import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Trash } from 'lucide-react'
import { CalendarEvent } from '@/types/calendar'
import { format } from 'date-fns'
import { EventForm } from './EventForm'

interface EventListProps {
  events: CalendarEvent[]
  date: Date
  onUpdateEvent: (eventId: string, event: Partial<CalendarEvent>) => Promise<void>
  onDeleteEvent: (id: string) => Promise<void>
}

export function EventList({ events, date, onUpdateEvent, onDeleteEvent }: EventListProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Events for {format(date, 'PPP')}</h3>
      {events.map(event => (
        <div key={event.id} className="bg-secondary p-4 rounded-md mb-2">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{event.title}</h4>
              <p>{event.description}</p>
              <p>Time: {format(new Date(event.startTime), 'p')} - {format(new Date(event.endTime), 'p')}</p>
              <p>Participants: {event.participants.join(', ')}</p>
            </div>
            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Event</DialogTitle>
                  </DialogHeader>
                  <EventForm event={event} onSubmit={(updatedEvent) => onUpdateEvent(event.id, updatedEvent)} />
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={() => onDeleteEvent(event.id)}><Trash className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
