
"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlusCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


const customEmergencyContactFormSchema = z.object({
  emergencyType: z.string().min(2, { message: "Emergency type must be at least 2 characters." }),
  contactName: z.string().min(2, { message: "Contact name must be at least 2 characters." }),
  contactPhone: z.string().min(7, { message: "Please enter a valid phone number." }), // Basic validation
  tag: z.string().optional(),
});

export type CustomEmergencyContactFormData = z.infer<typeof customEmergencyContactFormSchema>;

interface CustomEmergencyContactFormProps {
  onAddCustomContact: (data: CustomEmergencyContactFormData) => void;
}

export function CustomEmergencyContactForm({ onAddCustomContact }: CustomEmergencyContactFormProps) {
  const form = useForm<CustomEmergencyContactFormData>({
    resolver: zodResolver(customEmergencyContactFormSchema),
    defaultValues: {
      emergencyType: "",
      contactName: "",
      contactPhone: "",
      tag: "",
    },
  });

  const { formState: { isSubmitting }, reset } = form;

  const onSubmit: SubmitHandler<CustomEmergencyContactFormData> = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
    onAddCustomContact(data);
    reset();
  };

  return (
    <Card className="border-dashed border-primary/50 bg-primary/5">
        <CardHeader>
            <CardTitle className="text-lg font-semibold">Add New Custom Contact</CardTitle>
            <CardDescription>Specify the emergency scenario and contact details.</CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
                <FormField
                control={form.control}
                name="emergencyType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Emergency Type / Scenario</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., House Fire, Gas Leak, Flood" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., City Fire Department, Plumber XYZ" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Contact Phone Number</FormLabel>
                    <FormControl>
                        <Input type="tel" placeholder="e.g., 555-123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tag (Optional)</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Local Station, 24/7 Hotline, Preferred" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                    </>
                ) : (
                    <>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Contact
                    </>
                )}
                </Button>
            </CardContent>
            </form>
        </Form>
    </Card>
  );
}
