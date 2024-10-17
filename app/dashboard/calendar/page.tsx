'use client'

import React, { useState, useEffect } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users } from 'lucide-react'
import { getEvents, createEvent as apiCreateEvent, updateEvent, deleteEvent } from "@/services/calcom-api"
import { format } from 'date-fns'

interface CalendarEvent {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  participants: string[]
  type: 'appointment' | 'call' | 'task'
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('week')
  const [events, setEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      const fetchedEvents = await getEvents()
      setEvents(fetchedEvents)
    } catch (error) {
      console.error('Failed to fetch events:', error)
    }
  }

  function getDaysInWeek(date: Date) {
    const start = new Date(date)
    start.setDate(start.getDate() - start.getDay())
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(start)
      day.setDate(day.getDate() + i)
      days.push(day)
    }
    return days
  }

  function getHoursInDay() {
    return Array.from({ length: 24 }, (_, i) => i)
  }

  const handleCreateEvent = (calendarEvent: CalendarEvent) => {
    // Convertir CalendarEvent en Event
    const event = new Event('custom');
    Object.assign(event, {
      id: calendarEvent.id,
      title: calendarEvent.title,
      description: calendarEvent.description,
      startTime: calendarEvent.startTime,
      endTime: calendarEvent.endTime,
      participants: calendarEvent.participants,
      type: calendarEvent.type
    });

    apiCreateEvent(event).then(() => {
      fetchEvents();
    }).catch(error => {
      console.error('Failed to create event:', error);
    });
  };

  const handleUpdateEvent = (eventId: string, event: Partial<CalendarEvent>) => {
    updateEvent(eventId, event).then(() => {
      fetchEvents();
    }).catch(error => {
      console.error('Failed to update event:', error);
    });
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id).then(() => {
      fetchEvents();
    }).catch(error => {
      console.error('Failed to delete event:', error);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Calendar</h2>
        <div className="flex space-x-2">
          <Select value={view} onValueChange={(value: 'month' | 'week' | 'day') => setView(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Add Event</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input id="title" placeholder="Event Title" />
                <Textarea id="description" placeholder="Event Description" />
                <Input id="startTime" type="datetime-local" />
                <Input id="endTime" type="datetime-local" />
                <Input id="participants" placeholder="Participants (comma-separated)" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appointment">Appointment</SelectItem>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => {
                // Récupérez les valeurs des champs du formulaire
                const newEvent: CalendarEvent = {
                  id: Date.now().toString(), // Générez un ID temporaire
                  title: (document.getElementById('title') as HTMLInputElement).value,
                  description: (document.getElementById('description') as HTMLTextAreaElement).value,
                  startTime: (document.getElementById('startTime') as HTMLInputElement).value,
                  endTime: (document.getElementById('endTime') as HTMLInputElement).value,
                  participants: (document.getElementById('participants') as HTMLInputElement).value.split(','),
                  type: (document.getElementById('eventType') as HTMLSelectElement).value as 'appointment' | 'call' | 'task',
                };
                handleCreateEvent(newEvent);
              }}>Save Event</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => setDate(prev => {
          const newDate = new Date(prev!)
          newDate.setDate(newDate.getDate() - 7)
          return newDate
        })}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">
          {format(date!, 'MMMM d, yyyy')}
        </h3>
        <Button variant="outline" size="sm" onClick={() => setDate(prev => {
          const newDate = new Date(prev!)
          newDate.setDate(newDate.getDate() + 7)
          return newDate
        })}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {view === 'week' && (
        <div className="grid grid-cols-8 gap-2">
          <div className="col-span-1"></div>
          {getDaysInWeek(date!).map((day, index) => (
            <div key={index} className="text-center font-semibold">
              {format(day, 'EEE d')}
            </div>
          ))}
          {getHoursInDay().map((hour) => (
            <React.Fragment key={hour}>
              <div className="text-right pr-2">{hour}:00</div>
              {getDaysInWeek(date!).map((day, dayIndex) => (
                <div key={`${hour}-${dayIndex}`} className="border border-gray-200 h-12 relative">
                  {events
                    .filter(event => {
                      const eventDate = new Date(event.startTime)
                      return eventDate.getDate() === day.getDate() && 
                             eventDate.getMonth() === day.getMonth() && 
                             eventDate.getHours() === hour
                    })
                    .map(event => (
                      <div 
                        key={event.id} 
                        className={`absolute top-0 left-0 right-0 p-1 text-xs ${
                          event.type === 'appointment' ? 'bg-blue-200' :
                          event.type === 'call' ? 'bg-green-200' : 'bg-yellow-200'
                        }`}
                      >
                        {event.title}
                      </div>
                    ))
                  }
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      )}

      {view === 'day' && (
        <div className="space-y-2">
          {getHoursInDay().map((hour) => (
            <div key={hour} className="flex items-center">
              <div className="w-16 text-right pr-2">{hour}:00</div>
              <div className="flex-1 border border-gray-200 h-12 relative">
                {events
                  .filter(event => {
                    const eventDate = new Date(event.startTime)
                    return eventDate.getDate() === date!.getDate() && 
                           eventDate.getMonth() === date!.getMonth() && 
                           eventDate.getHours() === hour
                  })
                  .map(event => (
                    <div 
                      key={event.id} 
                      className={`absolute top-0 left-0 right-0 p-1 ${
                        event.type === 'appointment' ? 'bg-blue-200' :
                        event.type === 'call' ? 'bg-green-200' : 'bg-yellow-200'
                      }`}
                    >
                      {event.title}
                    </div>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'month' && (
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      )}

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
        {events.map(event => (
          <div key={event.id} className="bg-secondary p-4 rounded-md mb-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{event.title}</h4>
                <p className="text-sm text-gray-500">{event.description}</p>
                <div className="flex items-center mt-2">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm">{format(new Date(event.startTime), 'PPP')}</span>
                </div>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">{format(new Date(event.startTime), 'p')} - {format(new Date(event.endTime), 'p')}</span>
                </div>
                <div className="flex items-center mt-1">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm">{event.participants.join(', ')}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Edit</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Event</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Input id="title" defaultValue={event.title} />
                      <Textarea id="description" defaultValue={event.description} />
                      <Input id="startTime" type="datetime-local" defaultValue={event.startTime} />
                      <Input id="endTime" type="datetime-local" defaultValue={event.endTime} />
                      <Input id="participants" defaultValue={event.participants.join(', ')} />
                    </div>
                    <Button onClick={() => {
                      const updatedEventData: Partial<CalendarEvent> = {
                        title: (document.getElementById('editTitle') as HTMLInputElement).value,
                        description: (document.getElementById('editDescription') as HTMLTextAreaElement).value,
                        startTime: (document.getElementById('editStartTime') as HTMLInputElement).value,
                        endTime: (document.getElementById('editEndTime') as HTMLInputElement).value,
                        participants: (document.getElementById('editParticipants') as HTMLInputElement).value.split(','),
                        type: (document.getElementById('editEventType') as HTMLSelectElement).value as 'appointment' | 'call' | 'task',
                      };
                      handleUpdateEvent(event.id, updatedEventData);
                    }}>Save Changes</Button>
                    <Button onClick={() => handleDeleteEvent(event.id)}>Delete Event</Button>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
