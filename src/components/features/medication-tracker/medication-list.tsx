
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Pill, Edit3, Trash2, Bell, Clock, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
  lastTaken: string;
  nextDue: string;
  takenToday: boolean;
}

interface MedicationListProps {
  medications: Medication[];
}

export function MedicationList({ medications }: MedicationListProps) {
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
        <TooltipProvider>
          {medications.length > 0 ? (
            <ul className="space-y-4">
              {medications.map((med) => (
                <li key={med.id} className="relative p-4 border rounded-lg shadow-sm bg-background hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{med.name}</h3>
                        {med.notes && (
                           <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs">
                              <p className="text-sm font-code">{med.notes}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {med.dosage} - {med.frequency}
                      </p>
                       <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" /> 
                          <span>Next: {med.nextDue} (Last: {med.lastTaken})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
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
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" aria-label={`Edit ${med.name}`}>
                              <Edit3 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top"><p>Edit Medication</p></TooltipContent>
                      </Tooltip>
                       <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                           <Button variant="ghost" size="icon" aria-label={`Remind for ${med.name}`}>
                              <Bell className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top"><p>Set Reminder</p></TooltipContent>
                      </Tooltip>
                       <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Button variant="destructive" size="icon" aria-label={`Delete ${med.name}`}>
                              <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top"><p>Delete Medication</p></TooltipContent>
                      </Tooltip>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center py-4">No medications added yet. Use the form to add your first one!</p>
          )}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
