
"use client";

import { useState, useMemo, useEffect } from 'react';
import { CalendarDays, Pill, Stethoscope, Dot } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay } from 'date-fns';

type CalendarEventType = 'appointment' | 'medication';
interface CalendarEvent {
  id: string;
  date: Date;
  type: CalendarEventType;
  description: string;
  time?: string; 
}

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();

const initialMockEvents: CalendarEvent[] = [
  { id: '1', date: new Date(currentYear, currentMonth, 10), type: 'appointment', description: "Doctor's Checkup with Dr. Smith", time: "10:00 AM" },
  { id: '2', date: new Date(currentYear, currentMonth, 10), type: 'medication', description: "Refill Lisinopril prescription" },
  { id: '3', date: new Date(currentYear, currentMonth, 15), type: 'medication', description: "Take Metformin (Morning)" },
  { id: '4', date: new Date(currentYear, currentMonth, 15), type: 'medication', description: "Take Atorvastatin (Evening)" },
  { id: '5', date: new Date(currentYear, currentMonth, 22), type: 'appointment', description: "Dentist Appointment", time: "02:30 PM" },
  { id: '6', date: new Date(currentYear, currentMonth, Math.min(28, today.getDate() + 1)), type: 'appointment', description: "Physical Therapy Session", time: "09:00 AM" },
  { id: '7', date: new Date(currentYear, currentMonth, Math.min(28, today.getDate() + 1)), type: 'medication', description: "Take Vitamin D supplement" },
  { id: '8', date: new Date(currentYear, currentMonth, today.getDate()), type: 'medication', description: "Daily Multivitamin" },
];


export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
  const [month, setMonth] = useState<Date>(today);
  const [mockEvents, setMockEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    setMockEvents(initialMockEvents);
  }, []);

  const appointmentDates = useMemo(() =>
    mockEvents
      .filter(e => e.type === 'appointment' && !mockEvents.some(other => isSameDay(other.date, e.date) && other.type === 'medication'))
      .map(e => e.date),
    [mockEvents]
  );

  const medicationDates = useMemo(() =>
    mockEvents
      .filter(e => e.type === 'medication' && !mockEvents.some(other => isSameDay(other.date, e.date) && other.type === 'appointment'))
      .map(e => e.date),
    [mockEvents]
  );

  const appointmentAndMedicationDates = useMemo(() =>
    mockEvents
      .filter(e => {
        const hasAppointment = mockEvents.some(appt => isSameDay(appt.date, e.date) && appt.type === 'appointment');
        const hasMedication = mockEvents.some(med => isSameDay(med.date, e.date) && med.type === 'medication');
        return hasAppointment && hasMedication;
      })
      .map(e => e.date)
      .filter((date, index, self) => self.findIndex(d => isSameDay(d, date)) === index),
    [mockEvents]
  );

  const modifiers = {
    appointment: appointmentDates,
    medication: medicationDates,
    appointmentAndMedication: appointmentAndMedicationDates,
  };

  const modifiersClassNames = {
    appointment: 'day-appointment',
    medication: 'day-medication',
    appointmentAndMedication: 'day-appointment-medication',
    today: 'day-today',
  };

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return mockEvents.filter(event => isSameDay(event.date, selectedDate));
  }, [selectedDate, mockEvents]);

  const EventIcon = ({ type }: { type: CalendarEventType }) => {
    if (type === 'appointment') return <Stethoscope className="h-5 w-5 text-blue-500 mr-2 shrink-0" />;
    if (type === 'medication') return <Pill className="h-5 w-5 text-purple-500 mr-2 shrink-0" />;
    return <Dot className="h-5 w-5 text-muted-foreground mr-2 shrink-0" />;
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <CalendarDays className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold font-headline tracking-tight">Calendar View</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        View upcoming medication schedules and doctor appointments.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <Card className="md:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Monthly Schedule</CardTitle>
            <CardDescription>Highlighted dates for medications and appointments.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={month}
              onMonthChange={setMonth}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              className="p-0 rounded-md border"
              numberOfMonths={1}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-1 shadow-lg h-full">
          <CardHeader>
            <CardTitle className="font-headline">
              Events for {selectedDate ? format(selectedDate, 'MMMM do, yyyy') : 'Selected Date'}
            </CardTitle>
            <CardDescription>Details for the selected day.</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDayEvents.length > 0 ? (
              <ul className="space-y-3">
                {selectedDayEvents.map(event => (
                  <li key={event.id} className="flex items-start p-3 border rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
                    <EventIcon type={event.type} />
                    <div>
                      <p className="font-semibold">{event.description}</p>
                      {event.time && <p className="text-xs text-muted-foreground">{event.time}</p>}
                       <Badge
                        variant="outline"
                        className={`mt-1 capitalize ${
                          event.type === 'appointment'
                            ? 'border-blue-500/50 text-blue-700 dark:text-blue-400 bg-blue-500/10'
                            : 'border-purple-500/50 text-purple-700 dark:text-purple-400 bg-purple-500/10'
                        }`}
                      >
                        {event.type}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No events scheduled for this day.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Legend</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-md day-appointment"></span>
            <span>Appointment</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-md day-medication"></span>
            <span>Medication</span>
          </div>
           <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-md day-appointment-medication"></span>
            <span>Appointment & Medication</span>
          </div>
           <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-md day-today"></span>
            <span>Today</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
