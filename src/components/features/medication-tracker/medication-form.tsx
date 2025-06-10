
"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ListPlus, Loader2 } from "lucide-react";

const medicationFormSchema = z.object({
  name: z.string().min(2, { message: "Medication name must be at least 2 characters." }),
  dosage: z.string().min(1, { message: "Dosage is required." }),
  frequency: z.string().min(3, { message: "Frequency is required (e.g., Once a day)." }),
  notes: z.string().optional(),
});

export type MedicationFormData = z.infer<typeof medicationFormSchema>;

interface MedicationFormProps {
  onAddMedication: (data: MedicationFormData) => void;
}

export function MedicationForm({ onAddMedication }: MedicationFormProps) {
  const form = useForm<MedicationFormData>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues: {
      name: "",
      dosage: "",
      frequency: "",
      notes: "",
    },
  });

  const {formState: { isSubmitting } } = form;

  const onSubmit: SubmitHandler<MedicationFormData> = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    onAddMedication(data);
    form.reset(); // Reset form after successful submission
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ListPlus className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Add New Medication</CardTitle>
        </div>
        <CardDescription>Enter details for a new medication to track.</CardDescription>
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
            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Medication"
              )}
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
