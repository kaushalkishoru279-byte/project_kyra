import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill, ListPlus, CalendarClock } from "lucide-react";
import { MedicationForm } from "@/components/features/medication-tracker/medication-form";
import { MedicationList } from "@/components/features/medication-tracker/medication-list";

export default function MedicationPage() {
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
          <MedicationForm />
        </div>
        <div className="lg:col-span-2">
          <MedicationList />
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
