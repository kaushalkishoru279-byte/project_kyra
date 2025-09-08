
"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UploadCloud, Loader2 } from "lucide-react";
import { useState } from "react";

const recordFormSchema = z.object({
  name: z.string().min(3, { message: "Document name must be at least 3 characters." }),
  tags: z.string().optional(),
});

export type RecordFormData = z.infer<typeof recordFormSchema>;

interface RecordUploadProps {
  onAddRecord: (data: RecordFormData, fileInfo: { type: string; size: string; dataUrl?: string }) => void;
}

export function RecordUpload({ onAddRecord }: RecordUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | undefined>(undefined);
  const [fileNameDisplay, setFileNameDisplay] = useState<string>("");

  const form = useForm<RecordFormData>({
    resolver: zodResolver(recordFormSchema),
    defaultValues: {
      name: "",
      tags: "",
    },
  });

  const { formState: { isSubmitting }, reset } = form;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileNameDisplay(file.name);
      
      // Prefill document name if not already set
      if (!form.getValues("name")) {
        form.setValue("name", file.name.replace(/\.[^/.]+$/, ""));
      }

      // Read file for preview if it's an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFileDataUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFileDataUrl(undefined);
      }
    } else {
      setSelectedFile(null);
      setFileNameDisplay("");
      setFileDataUrl(undefined);
    }
  };

  const onSubmit: SubmitHandler<RecordFormData> = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('tags', data.tags ?? '');
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    const res = await fetch('/api/records', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      throw new Error('Upload failed');
    }

    const fileInfo = {
      type: selectedFile ? (selectedFile.type || 'FILE') : 'FILE',
      size: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB` : '0MB',
      dataUrl: fileDataUrl,
    };

    onAddRecord(data, fileInfo);

    // Reset form and state
    reset();
    setSelectedFile(null);
    setFileDataUrl(undefined);
    setFileNameDisplay("");
    const fileInput = document.getElementById('recordFile') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UploadCloud className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Upload New Record</CardTitle>
        </div>
        <CardDescription>Add a new medical report or document.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormItem>
              <FormLabel htmlFor="recordFile">Choose File (Optional)</FormLabel>
              <FormControl>
                <Input id="recordFile" type="file" onChange={handleFileChange} accept="image/png, image/jpeg, image/gif, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
              </FormControl>
              {fileNameDisplay && <p className="text-xs text-muted-foreground mt-1">Selected: {fileNameDisplay}</p>}
              <p className="text-xs text-muted-foreground mt-1">Supported: PDF, DOCX, JPG, etc. (Simulated)</p>
            </FormItem>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name / Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Blood Test Results - Jan 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated, optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., blood test, cardiology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload Record
                </>
              )}
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
