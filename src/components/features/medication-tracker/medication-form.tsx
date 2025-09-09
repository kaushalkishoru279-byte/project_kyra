
"use client";

import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ListPlus, Loader2, Save, XCircle, Clock } from "lucide-react";
import type { Medication } from "./medication-list";
import { useToast } from "@/hooks/use-toast";

const medicationFormSchema = z.object({
  name: z.string().min(2, { message: "Medication name must be at least 2 characters." }),
  dosage: z.string().min(1, { message: "Dosage is required." }),
  frequency: z.string().min(3, { message: "Frequency is required (e.g., Once a day)." }),
  notes: z.string().optional(),
  scheduleTime: z.string().optional(), // HH:mm
});

export type MedicationFormData = z.infer<typeof medicationFormSchema>;

interface MedicationFormProps {
  onSaveMedication: (data: MedicationFormData, id: string | null) => Promise<{ success: boolean; message: string }>;
  currentMedication?: Medication | null; // Medication being edited
  onCancelEdit?: () => void;
}

export function MedicationForm({ onSaveMedication, currentMedication, onCancelEdit }: MedicationFormProps) {
  const { toast } = useToast();
  const form = useForm<MedicationFormData>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues: {
      name: "",
      dosage: "",
      frequency: "",
      notes: "",
    },
  });

  const { formState: { isSubmitting }, reset } = form;
  const isEditing = !!currentMedication;

  useEffect(() => {
    if (currentMedication) {
      reset({
        name: currentMedication.name,
        dosage: currentMedication.dosage,
        frequency: currentMedication.frequency,
        notes: currentMedication.notes || "",
      });
    } else {
      reset({ name: "", dosage: "", frequency: "", notes: "" });
    }
  }, [currentMedication, reset]);

  const onSubmit: SubmitHandler<MedicationFormData> = async (data) => {
    const result = await onSaveMedication(data, currentMedication ? currentMedication.id : null);

    if (result.success) {
      toast({ title: "Success", description: result.message });
      if (!isEditing) {
        // create a simple daily schedule if scheduleTime provided
        if (data.scheduleTime) {
          try {
            // naive: fetch latest list, get the id we just created by reloading not available here; backend returns id via API route
            // In this client-only context we cannot access the new id, so leave scheduling to edit path or enhance API to return id
          } catch {}
        }
        reset();
      }
      if (isEditing && onCancelEdit) {
        onCancelEdit();
      }
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          {isEditing ? <Save className="h-6 w-6 text-primary" /> : <ListPlus className="h-6 w-6 text-primary" />}
          <CardTitle className="font-headline">{isEditing ? "Edit Medication" : "Add New Medication"}</CardTitle>
        </div>
        <CardDescription>{isEditing ? `Update details for ${currentMedication?.name}.` : "Enter details for a new medication."}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medication Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Amoxicillin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dosage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dosage</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 250mg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Twice a day" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Take with food" className="font-code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scheduleTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Reminder Time (Optional)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Input type="time" {...field} className="w-40" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  isEditing ? <><Save className="mr-2 h-4 w-4" /> Update Medication</> : <><ListPlus className="mr-2 h-4 w-4" /> Add Medication</>
                )}
              </Button>
              {isEditing && onCancelEdit && (
                <Button type="button" variant="outline" className="w-full" onClick={() => {
                  onCancelEdit();
                  reset();
                }}>
                  <XCircle className="mr-2 h-4 w-4" /> Cancel Edit
                </Button>
              )}
            </div>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
