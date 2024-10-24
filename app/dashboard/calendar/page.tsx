'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users } from 'lucide-react'
import { getEvents, createEvent, updateEvent, deleteEvent } from "@/services/calcom-api"
import { format, parseISO } from 'date-fns'
import { DayPickerCalendar } from '@/components/calendar/DayPickerCalendar'
import { EventList } from '@/components/calendar/event-list'
import { AddEventDialog } from '@/components/calendar/AddEventDialog'
import { CalendarEvent as CalendarEventType } from '@/types/calendar';

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const fetchedEvents = await getEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  }

  const handleCreateEvent = async (calendarEvent: CalendarEvent) => {
    try {
      await createEvent(calendarEvent);
      await fetchEvents();
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleUpdateEvent = async (eventId: string, event: Partial<CalendarEvent>) => {
    try {
      await updateEvent(eventId, event);
      await fetchEvents();
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
      await fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  return (
    <div className="space-y-4 p-4 max-w-full mx-auto">
      <h2 className="text-3xl font-bold text-white mb-4">Calendar</h2>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <DayPickerCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            events={events}
          />
        </div>
        <div className="lg:w-1/4">
          <EventList
            events={events.filter(event => 
              selectedDate && new Date(event.startTime).toDateString() === selectedDate.toDateString()
            )}
            date={selectedDate || new Date()} // Fournissez une valeur par défaut
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
          />
          <AddEventDialog onAddEvent={handleCreateEvent} selectedDate={selectedDate || new Date()} />
        </div>
      </div>
    </div>
  );
}
