import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Trash } from 'lucide-react'

interface Event {
  id: number
  title: string
  description: string
  date: Date
  participants: string[]
}

interface EventListProps {
  events: Event[]
  date: Date | undefined
}

export function EventList({ events, date }: EventListProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Events for {date?.toDateString()}</h3>
      {events
        .filter(event => event.date.toDateString() === date?.toDateString())
        .map(event => (
          <div key={event.id} className="bg-secondary p-4 rounded-md mb-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{event.title}</h4>
                <p>{event.description}</p>
                <p>Time: {event.date.toLocaleTimeString()}</p>
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
                    <div className="grid gap-4 py-4">
                      <Input id="title" defaultValue={event.title} />
                      <Textarea id="description" defaultValue={event.description} />
                      <Input id="date" type="datetime-local" defaultValue={event.date.toISOString().slice(0, 16)} />
                      <Input id="participants" defaultValue={event.participants.join(', ')} />
                    </div>
                    <Button>Save Changes</Button>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm"><Trash className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}
