"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ListPlus } from "lucide-react";

export function MedicationForm() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ListPlus className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Add New Medication</CardTitle>
        </div>
        <CardDescription>Enter details for a new medication to track.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="medName">Medication Name</Label>
          <Input id="medName" placeholder="e.g., Amoxicillin" />
        </div>
        <div>
          <Label htmlFor="dosage">Dosage</Label>
          <Input id="dosage" placeholder="e.g., 250mg" />
        </div>
        <div>
          <Label htmlFor="frequency">Frequency</Label>
          <Input id="frequency" placeholder="e.g., Twice a day" />
        </div>
         <div>
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea id="notes" placeholder="e.g., Take with food" className="font-code" />
        </div>
        <Button className="w-full mt-2">
          Add Medication
        </Button>
      </CardContent>
    </Card>
  );
}
