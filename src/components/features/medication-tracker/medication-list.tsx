"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Pill, Edit3, Trash2, Bell, Clock } from "lucide-react";

const medications = [
  { id: "1", name: "Lisinopril", dosage: "10mg", frequency: "Once daily (Morning)", lastTaken: "Today, 8:00 AM", nextDue: "Tomorrow, 8:00 AM", takenToday: true },
  { id: "2", name: "Metformin", dosage: "500mg", frequency: "Twice daily (Morning, Evening)", lastTaken: "Today, 9:00 AM", nextDue: "Today, 7:00 PM", takenToday: false },
  { id: "3", name: "Atorvastatin", dosage: "20mg", frequency: "Once daily (Evening)", lastTaken: "Yesterday, 9:00 PM", nextDue: "Today, 9:00 PM", takenToday: false },
];

export function MedicationList() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Pill className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Current Medications</CardTitle>
        </div>
        <CardDescription>Overview of all registered medications and their status.</CardDescription>
      </CardHeader>
      <CardContent>
        {medications.length > 0 ? (
          <ul className="space-y-4">
            {medications.map((med) => (
              <li key={med.id} className="p-4 border rounded-lg shadow-sm bg-background hover:bg-muted/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{med.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {med.dosage} - {med.frequency}
                    </p>
                     <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" /> 
                        <span>Next: {med.nextDue}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="flex items-center space-x-2">
                        <Checkbox id={`taken-${med.id}`} checked={med.takenToday} aria-label={`Mark ${med.name} as taken`}/>
                        <label
                          htmlFor={`taken-${med.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Taken Today
                        </label>
                      </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 sm:mt-0 sm:absolute sm:right-4 sm:top-1/2 sm:-translate-y-1/2">
                    <Button variant="outline" size="icon" aria-label={`Edit ${med.name}`}>
                        <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label={`Remind for ${med.name}`}>
                        <Bell className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" aria-label={`Delete ${med.name}`}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-center py-4">No medications added yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
