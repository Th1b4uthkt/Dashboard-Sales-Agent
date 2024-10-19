import { CalendarEvent } from '@/types/calendar';
import { parseISO } from 'date-fns';

const API_KEY = process.env.NEXT_PUBLIC_CALCOM_API_KEY;
const BASE_URL = 'https://api.cal.com/v2';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'cal-api-version': '2024-06-11',
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('API Error:', errorBody);
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
  }

  return response.json();
}

export async function getEvents(): Promise<CalendarEvent[]> {
  const userId = process.env.NEXT_PUBLIC_USER_ID;
  const response = await fetchWithAuth(`/bookings?userId=${userId}`);
  return response.data.map((event: any) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    startTime: event.start_time,
    endTime: event.end_time,
    participants: event.attendees?.map((attendee: any) => attendee.email) || [],
    type: event.event_type || 'appointment',
    attendees: event.attendees,
  }));
}

export async function getSchedules() {
  return fetchWithAuth('/schedules');
}

export async function createEvent(event: Partial<CalendarEvent>) {
  return fetchWithAuth('/bookings', {
    method: 'POST',
    body: JSON.stringify(event),
  });
}

export async function updateEvent(eventId: string, event: Partial<CalendarEvent>) {
  return fetchWithAuth(`/bookings/${eventId}`, {
    method: 'PATCH',
    body: JSON.stringify(event),
  });
}

export async function deleteEvent(eventId: string) {
  return fetchWithAuth(`/bookings/${eventId}`, {
    method: 'DELETE',
  });
}
