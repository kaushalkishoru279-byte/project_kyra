
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill, CalendarClock } from "lucide-react";
import { MedicationForm, type MedicationFormData } from "@/components/features/medication-tracker/medication-form";
import { MedicationList, type Medication } from "@/components/features/medication-tracker/medication-list";
import { useToast } from "@/hooks/use-toast";

const initialMedications: Medication[] = [
  { id: "1", name: "Lisinopril", dosage: "10mg", frequency: "Once daily (Morning)", notes: "Take with breakfast", lastTaken: "Today, 8:00 AM", nextDue: "Tomorrow, 8:00 AM", takenToday: true },
  { id: "2", name: "Metformin", dosage: "500mg", frequency: "Twice daily (Morning, Evening)", notes: "With meals", lastTaken: "Today, 9:00 AM", nextDue: "Today, 7:00 PM", takenToday: false },
  { id: "3", name: "Atorvastatin", dosage: "20mg", frequency: "Once daily (Evening)", notes: "Before bed", lastTaken: "Yesterday, 9:00 PM", nextDue: "Today, 9:00 PM", takenToday: false },
];


export default function MedicationPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load initial or stored medications
    // In a real app, this would fetch from a DB or localStorage
    setMedications(initialMedications);
  }, []);

  const handleSaveMedication = (data: MedicationFormData) => {
    if (editingMedication) {
      // Update existing medication
      setMedications(prevMedications =>
        prevMedications.map(med =>
          med.id === editingMedication.id
            ? { ...med, ...data, lastTaken: med.lastTaken, nextDue: med.nextDue, takenToday: med.takenToday } // Preserve status fields
            : med
        )
      );
      toast({ title: "Medication Updated", description: `${data.name} has been updated.` });
      setEditingMedication(null); // Clear editing state
    } else {
      // Add new medication
      const newMedication: Medication = {
        id: Date.now().toString(), // Simple ID generation
        ...data,
        lastTaken: "Not yet taken", // These would be calculated in a real app
        nextDue: "Pending schedule", // These would be calculated in a real app
        takenToday: false,
      };
      setMedications(prevMedications => [newMedication, ...prevMedications]);
      toast({ title: "Medication Added", description: `${data.name} has been added to your list.` });
    }
  };

  const handleSetEditing = (medication: Medication | null) => {
    setEditingMedication(medication);
  };

  const handleDeleteMedication = (medicationId: string) => {
    const medToDelete = medications.find(m => m.id === medicationId);
    setMedications(prevMedications => prevMedications.filter(med => med.id !== medicationId));
    if (medToDelete) {
      toast({ title: "Medication Deleted", description: `${medToDelete.name} has been removed.`, variant: "destructive" });
    }
    if (editingMedication?.id === medicationId) {
      setEditingMedication(null); // Clear editing state if the deleted medication was being edited
    }
  };

  const handleToggleTaken = (medicationId: string) => {
    setMedications(prevMedications =>
      prevMedications.map(med => {
        if (med.id === medicationId) {
          const newTakenStatus = !med.takenToday;
          // In a real app, update lastTaken and nextDue based on this change
          const newLastTaken = newTakenStatus ? `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : med.lastTaken; // Simplified
          return { ...med, takenToday: newTakenStatus, lastTaken: newLastTaken };
        }
        return med;
      })
    );
    const updatedMed = medications.find(m => m.id === medicationId);
    if (updatedMed) {
       toast({ title: "Status Updated", description: `${updatedMed.name} marked as ${updatedMed.takenToday ? 'taken' : 'not taken'}.` });
    }
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
          <MedicationForm
            onSaveMedication={handleSaveMedication}
            currentMedication={editingMedication}
            onCancelEdit={() => setEditingMedication(null)}
          />
        </div>
        <div className="lg:col-span-2">
          <MedicationList
            medications={medications}
            onEdit={handleSetEditing}
            onDelete={handleDeleteMedication}
            onToggleTaken={handleToggleTaken}
            // onSetReminder is now handled internally by MedicationList for dialog
          />
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
          <p className="text-sm text-muted-foreground">Real-time intake tracking and alerts for missed doses will be displayed here. (Functionality to be implemented)</p>
        </CardContent>
      </Card>
    </div>
  );
}
