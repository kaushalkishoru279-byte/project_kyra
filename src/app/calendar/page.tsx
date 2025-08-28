
"use client";

import { useState, useMemo, useEffect } from 'react';
import { CalendarDays, Pill, Stethoscope, Dot, Gift, PartyPopper, Plane, Video, ListChecks, CheckSquare, Trash2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { format, isSameDay } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type CalendarEventType = 'appointment' | 'medication' | 'birthday' | 'generalEvent' | 'travel' | 'videoCall';

interface CalendarEvent {
  id: string;
  date: Date;
  type: CalendarEventType;
  description: string;
  time?: string;
}

interface ToDoItem {
  id: string;
  text: string;
  dueDate?: string;
  completed: boolean;
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
  { id: '9', date: new Date(currentYear, currentMonth, 5), type: 'birthday', description: "Grandma's Birthday Party", time: "06:00 PM" },
  { id: '10', date: new Date(currentYear, currentMonth, 18), type: 'generalEvent', description: "Family Game Night" },
  { id: '11', date: new Date(currentYear, currentMonth, 25), type: 'travel', description: "Trip to the lakehouse", time: "Departing 08:00 AM" },
  { id: '12', date: new Date(currentYear, currentMonth, 7), type: 'videoCall', description: "Video call with Aunt Susan", time: "07:30 PM" },
  { id: '13', date: new Date(currentYear, currentMonth, 12), type: 'birthday', description: "John's Birthday" },
];

const initialToDos: ToDoItem[] = [
    { id: 'todo1', text: "Buy gift for Grandma's birthday", dueDate: format(new Date(currentYear, currentMonth, 3), 'MMM dd'), completed: false },
    { id: 'todo2', text: "Plan Christmas trip details", completed: false },
    { id: 'todo3', text: "Schedule Mom's doctor follow-up", dueDate: format(new Date(currentYear, currentMonth, 20), 'MMM dd'), completed: true },
];


export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
  const [month, setMonth] = useState<Date>(today);
  const [mockEvents, setMockEvents] = useState<CalendarEvent[]>([]);
  const [toDos, setToDos] = useState<ToDoItem[]>(initialToDos);
  const [newToDoText, setNewToDoText] = useState('');
  const [newToDoDueDate, setNewToDoDueDate] = useState('');
  const { toast } = useToast();

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
    return mockEvents.filter(event => isSameDay(event.date, selectedDate)).sort((a, b) => {
        // Sort by time if available, otherwise keep original order
        if (a.time && b.time) return a.time.localeCompare(b.time);
        if (a.time) return -1;
        if (b.time) return 1;
        return 0;
    });
  }, [selectedDate, mockEvents]);

  const EventIcon = ({ type }: { type: CalendarEventType }) => {
    const iconClass = "h-5 w-5 mr-2 shrink-0";
    if (type === 'appointment') return <Stethoscope className={`${iconClass} text-blue-500`} />;
    if (type === 'medication') return <Pill className={`${iconClass} text-purple-500`} />;
    if (type === 'birthday') return <Gift className={`${iconClass} text-pink-500`} />;
    if (type === 'generalEvent') return <PartyPopper className={`${iconClass} text-orange-500`} />;
    if (type === 'travel') return <Plane className={`${iconClass} text-green-500`} />;
    if (type === 'videoCall') return <Video className={`${iconClass} text-teal-500`} />;
    return <Dot className={`${iconClass} text-muted-foreground`} />;
  };

  const getEventTypeLabel = (type: CalendarEventType) => {
    switch (type) {
      case 'appointment': return 'Appointment';
      case 'medication': return 'Medication';
      case 'birthday': return 'Birthday';
      case 'generalEvent': return 'Event';
      case 'travel': return 'Travel';
      case 'videoCall': return 'Video Call';
      default: return 'Event';
    }
  };

  const getBadgeClass = (type: CalendarEventType) => {
    switch (type) {
      case 'appointment': return 'border-blue-500/50 text-blue-700 dark:text-blue-400 bg-blue-500/10';
      case 'medication': return 'border-purple-500/50 text-purple-700 dark:text-purple-400 bg-purple-500/10';
      case 'birthday': return 'border-pink-500/50 text-pink-700 dark:text-pink-400 bg-pink-500/10';
      case 'generalEvent': return 'border-orange-500/50 text-orange-700 dark:text-orange-400 bg-orange-500/10';
      case 'travel': return 'border-green-500/50 text-green-700 dark:text-green-400 bg-green-500/10';
      case 'videoCall': return 'border-teal-500/50 text-teal-700 dark:text-teal-400 bg-teal-500/10';
      default: return 'border-muted-foreground/50 text-muted-foreground bg-muted/30';
    }
  };

  const handleAddToDo = () => {
    if (!newToDoText.trim()) {
      toast({ title: "To-Do text cannot be empty.", variant: "destructive" });
      return;
    }
    const newToDo: ToDoItem = {
      id: `todo-${Date.now()}`,
      text: newToDoText,
      dueDate: newToDoDueDate || undefined,
      completed: false,
    };
    setToDos(prev => [newToDo, ...prev]);
    setNewToDoText('');
    setNewToDoDueDate('');
    toast({ title: "To-Do Added", description: newToDo.text });
  };

  const handleToggleToDoComplete = (id: string) => {
    setToDos(prev => prev.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const handleDeleteToDo = (id: string) => {
    const todoToDelete = toDos.find(todo => todo.id === id);
    setToDos(prev => prev.filter(todo => todo.id !== id));
    if (todoToDelete) {
      toast({ title: "To-Do Deleted", description: todoToDelete.text, variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <CalendarDays className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold font-headline tracking-tight">Family Calendar & Tasks</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        View upcoming schedules, family events, and manage shared tasks.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Monthly Schedule</CardTitle>
            <CardDescription>Highlighted dates for medications and appointments. Other events listed below.</CardDescription>
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
           <CardContent className="pt-4">
                <CardTitle className="font-headline text-xl mb-2">
                Events for {selectedDate ? format(selectedDate, 'MMMM do, yyyy') : 'Selected Date'}
                </CardTitle>
                {selectedDayEvents.length > 0 ? (
                <ul className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedDayEvents.map(event => (
                    <li key={event.id} className="flex items-start p-3 border rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
                        <EventIcon type={event.type} />
                        <div>
                        <p className="font-semibold">{event.description}</p>
                        {event.time && <p className="text-xs text-muted-foreground">{event.time}</p>}
                        <Badge
                            variant="outline"
                            className={`mt-1 capitalize text-xs ${getBadgeClass(event.type)}`}
                        >
                            {getEventTypeLabel(event.type)}
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

        <div className="lg:col-span-1 space-y-8">
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
                        <span>Appt & Med</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-md day-today"></span>
                        <span>Today</span>
                    </div>
                    <div className="flex items-center gap-2"><Gift className="h-4 w-4 text-pink-500" /> Birthday</div>
                    <div className="flex items-center gap-2"><PartyPopper className="h-4 w-4 text-orange-500" /> Event</div>
                    <div className="flex items-center gap-2"><Plane className="h-4 w-4 text-green-500" /> Travel</div>
                    <div className="flex items-center gap-2"><Video className="h-4 w-4 text-teal-500" /> Video Call</div>
                </CardContent>
            </Card>
        </div>
      </div>

      <Separator />

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Shared To-Do List</CardTitle>
          </div>
          <CardDescription>Collaborate on family tasks and errands.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="New to-do task..."
              value={newToDoText}
              onChange={(e) => setNewToDoText(e.target.value)}
              className="flex-grow"
            />
            <Input
              placeholder="Due date (e.g., Tomorrow)"
              value={newToDoDueDate}
              onChange={(e) => setNewToDoDueDate(e.target.value)}
              className="w-1/3"
            />
            <Button onClick={handleAddToDo}>Add Task</Button>
          </div>
          {toDos.length > 0 ? (
            <ul className="space-y-2">
              {toDos.map(todo => (
                <li key={todo.id} className="flex items-center gap-3 p-3 border rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleToDoComplete(todo.id)}
                    aria-label={`Mark ${todo.text} as ${todo.completed ? 'incomplete' : 'complete'}`}
                  />
                  <label htmlFor={`todo-${todo.id}`} className={`flex-grow cursor-pointer ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                    <span className="font-medium">{todo.text}</span>
                    {todo.dueDate && <span className="ml-2 text-xs text-muted-foreground"> (Due: {todo.dueDate})</span>}
                  </label>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the to-do: "{todo.text}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteToDo(todo.id)}>Delete To-Do</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No tasks yet. Add one above!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
