export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: string | Date;
  endTime: string | Date;
  participants: string[];
  type: 'appointment' | 'call' | 'task';
  attendees?: { email: string }[];
}
