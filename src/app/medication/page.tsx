
"use server";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill, CalendarClock } from "lucide-react";
import { MedicationClientPage } from './client-page';
import { RemindersWidget } from './reminders-widget';
// Switched from Firebase to Postgres-backed API endpoints handled client-side


export default async function MedicationPage() {


  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Pill className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold font-headline tracking-tight">Medication Tracker</h1>
      </div>
       <p className="text-lg text-muted-foreground">
        Keep track of medications, dosages, and schedules. Your data is now saved to the database.
      </p>

      

      <MedicationClientPage />
      <RemindersWidget />
    </div>
  );
}
