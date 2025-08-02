
"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const familyMemberFormSchema = z.object({
  name: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  role: z.string({ required_error: "Please select a role." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export type FamilyMemberFormData = z.infer<typeof familyMemberFormSchema>;

interface FamilyMemberFormProps {
  onAddMember: (data: FamilyMemberFormData) => Promise<{ success: boolean; message: string }>;
}

export function FamilyMemberForm({ onAddMember }: FamilyMemberFormProps) {
  const { toast } = useToast();
  const form = useForm<FamilyMemberFormData>({
    resolver: zodResolver(familyMemberFormSchema),
    defaultValues: {
      name: "",
      role: undefined,
      email: "",
    },
  });

  const { formState: { isSubmitting }, reset } = form;

  const onSubmit: SubmitHandler<FamilyMemberFormData> = async (data) => {
    const result = await onAddMember(data);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      reset();
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
         <UserPlus className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Add Family Member</CardTitle>
        </div>
        <CardDescription>Enter details for a new family or care team member.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Primary Caregiver">Primary Caregiver</SelectItem>
                      <SelectItem value="Family Member">Family Member</SelectItem>
                      <SelectItem value="Doctor">Doctor</SelectItem>
                      <SelectItem value="Friend/Neighbor">Friend/Neighbor</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="e.g., jane.doe@example.com" {...field} />
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
                <>
                  <UserPlus className="mr-2 h-4 w-4" /> Add Member to Database
                </>
              )}
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
