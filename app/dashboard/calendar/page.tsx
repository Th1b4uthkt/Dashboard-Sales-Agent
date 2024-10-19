'use client'

import React, { useState, useEffect } from 'react'
// Suppression de cette ligne pour résoudre l'erreur de 'Calendar' non utilisé
// import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users } from 'lucide-react'
import { getEvents, createEvent, updateEvent, deleteEvent } from "@/services/calcom-api"
import { format, parseISO } from 'date-fns'

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: string | Date;  // Change this to allow both string and Date
  endTime: string | Date;    // Change this to allow both string and Date
  participants: string[];
  type: 'appointment' | 'call' | 'task';
  attendees?: { email: string }[];
}

// Ajoutez cette fonction utilitaire en haut du fichier, après les imports
function formatDateForInput(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().slice(0, 16); // Format YYYY-MM-DDTHH:mm
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('week')
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  // Commentez ces lignes si elles ne sont pas utilisées pour le moment
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    // setIsLoading(true);
    // setError(null);
    try {
      const fetchedEvents = await getEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      // setError('Failed to load events. Please check your API key and permissions.');
    } finally {
      // setIsLoading(false);
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
    return Array.from({ length: 13 }, (_, i) => i + 8);
  }

  const handleCreateEvent = async (calendarEvent: CalendarEvent) => {
    try {
      await createEvent(calendarEvent);
      await fetchEvents();
    } catch (error) {
      console.error('Failed to create event:', error);
      // setError('Failed to create event. Please try again.');
    }
  };

  const handleUpdateEvent = async (eventId: string, event: Partial<CalendarEvent>) => {
    try {
      await updateEvent(eventId, event);
      await fetchEvents();
    } catch (error) {
      console.error('Failed to update event:', error);
      // setError('Failed to update event. Please try again.');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
      await fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
      // setError('Failed to delete event. Please try again.');
    }
  };

  const formatDate = (date: string | Date) => {
    try {
      return format(typeof date === 'string' ? parseISO(date) : date, 'PPP');
    } catch {
      console.error('Invalid date:', date);
      return 'Invalid date';
    }
  };

  const formatTime = (date: string | Date) => {
    try {
      return format(typeof date === 'string' ? parseISO(date) : date, 'p');
    } catch {
      console.error('Invalid time:', date);
      return 'Invalid time';
    }
  };

  return (
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-white mb-4 sm:mb-0">Calendar</h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
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
      
      <div className="flex items-center justify-between mb-4">
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
        <div className="overflow-x-auto">
          <div className="grid grid-cols-8 gap-2 min-w-[800px]">
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
                  <div key={`${hour}-${dayIndex}`} className="border border-gray-200 h-16 relative">
                    {events
                      .filter(event => {
                        const eventStart = new Date(event.startTime);
                        return eventStart.getDate() === day.getDate() &&
                               eventStart.getMonth() === day.getMonth() &&
                               eventStart.getHours() === hour;
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
        </div>
      )}

      {view === 'day' && (
        <div className="space-y-2">
          {getHoursInDay().map((hour) => (
            <div key={hour} className="flex items-center">
              <div className="w-16 text-right pr-2">{hour}:00</div>
              <div className="flex-1 border border-gray-200 h-16 relative">
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
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold">{day}</div>
          ))}
          {Array.from({ length: 35 }, (_, i) => {
            const currentDate = new Date(date!.getFullYear(), date!.getMonth(), i - date!.getDay() + 1);
            const isCurrentMonth = currentDate.getMonth() === date!.getMonth();
            const dayEvents = events.filter(event => {
              const eventDate = new Date(event.startTime);
              return eventDate.getDate() === currentDate.getDate() &&
                     eventDate.getMonth() === currentDate.getMonth() &&
                     eventDate.getFullYear() === currentDate.getFullYear();
            });
            
            return (
              <div key={i} className={`border p-2 h-32 overflow-y-auto ${isCurrentMonth ? 'bg-white' : 'bg-gray-100'}`}>
                <div className="font-semibold">{format(currentDate, 'd')}</div>
                {dayEvents.map(event => (
                  <div key={event.id} className={`text-xs p-1 mt-1 rounded ${
                    event.type === 'appointment' ? 'bg-blue-200' :
                    event.type === 'call' ? 'bg-green-200' : 'bg-yellow-200'
                  }`}>
                    {event.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map(event => (
            <div key={event.id} className="bg-secondary p-4 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                  <div className="flex items-center mt-2">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{formatDate(event.startTime)}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </span>
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
                        <Input id="editTitle" defaultValue={event.title} />
                        <Textarea id="editDescription" defaultValue={event.description} />
                        <Input 
                          id="editStartTime" 
                          type="datetime-local" 
                          defaultValue={formatDateForInput(event.startTime)} 
                        />
                        <Input 
                          id="editEndTime" 
                          type="datetime-local" 
                          defaultValue={formatDateForInput(event.endTime)} 
                        />
                        <Input id="editParticipants" defaultValue={event.participants.join(', ')} />
                        <Select defaultValue={event.type}>
                          <SelectTrigger id="editEventType">
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
    </div>
  )
}
