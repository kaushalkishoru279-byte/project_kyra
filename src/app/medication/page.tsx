
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill, CalendarClock } from "lucide-react";
import { MedicationForm, type MedicationFormData } from "@/components/features/medication-tracker/medication-form";
import { MedicationList, type Medication } from "@/components/features/medication-tracker/medication-list";

const initialMedications: Medication[] = [
  { id: "1", name: "Lisinopril", dosage: "10mg", frequency: "Once daily (Morning)", notes: "Take with breakfast", lastTaken: "Today, 8:00 AM", nextDue: "Tomorrow, 8:00 AM", takenToday: true },
  { id: "2", name: "Metformin", dosage: "500mg", frequency: "Twice daily (Morning, Evening)", notes: "With meals", lastTaken: "Today, 9:00 AM", nextDue: "Today, 7:00 PM", takenToday: false },
  { id: "3", name: "Atorvastatin", dosage: "20mg", frequency: "Once daily (Evening)", notes: "Before bed", lastTaken: "Yesterday, 9:00 PM", nextDue: "Today, 9:00 PM", takenToday: false },
];


export default function MedicationPage() {
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    // Load initial or stored medications
    setMedications(initialMedications);
  }, []);

  const handleAddMedication = (data: MedicationFormData) => {
    const newMedication: Medication = {
      id: Date.now().toString(), // Simple ID generation
      name: data.name,
      dosage: data.dosage,
      frequency: data.frequency,
      notes: data.notes,
      lastTaken: "Not yet taken", // Default values
      nextDue: "Pending schedule",  // Default values
      takenToday: false,          // Default values
    };
    setMedications(prevMedications => [...prevMedications, newMedication]);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Pill className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold font-headline tracking-tight">Medication Tracker</h1>
      </div>
       <p className="text-lg text-muted-foreground">
        Keep track of medications, dosages, and schedules. Receive reminders for intake.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <MedicationForm onAddMedication={handleAddMedication} />
        </div>
        <div className="lg:col-span-2">
          <MedicationList medications={medications} />
        </div>
      </div>
       <Card className="mt-8 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-primary"/>
            <CardTitle className="font-headline">Upcoming Doses & Alerts</CardTitle>
          </div>
          <CardDescription>View upcoming medication schedule and any missed dose alerts.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Real-time intake tracking and alerts for missed doses will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
