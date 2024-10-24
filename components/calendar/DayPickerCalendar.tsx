'use client'

import React from 'react';
import { DayPicker, DayPickerDefaultProps } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { CalendarEvent } from '@/types/calendar';

interface DayPickerCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  events: CalendarEvent[];
}

export function DayPickerCalendar({ selectedDate, onSelectDate, events }: DayPickerCalendarProps) {
  const footer = selectedDate ? (
    <p>You selected {format(selectedDate, 'PPP')}.</p>
  ) : (
    <p>Please pick a day.</p>
  );

  const dayPickerProps: DayPickerDefaultProps = {
    mode: "single",
    selected: selectedDate,
    onSelect: onSelectDate,
    captionLayout: "dropdown",
    firstWeekContainsDate: 1,
    ISOWeek: true,
    numberOfMonths: 2,
    pagedNavigation: true,
    showWeekNumber: true,
    weekStartsOn: 1,
    modifiers: {
      hasEvent: (date: Date) => events.some(event => 
        new Date(event.startTime).toDateString() === date.toDateString()
      )
    },
    modifiersStyles: {
      hasEvent: { backgroundColor: 'lightblue' }
    }
  };

  return (
    <DayPicker {...dayPickerProps} />
  );
}
