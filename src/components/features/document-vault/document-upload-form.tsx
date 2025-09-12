
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, Loader2, FileUp } from "lucide-react";

const documentFormSchema = z.object({
  name: z.string().min(3, { message: "Document name must be at least 3 characters." }),
  documentType: z.string({ required_error: "Please select a document type." }),
  description: z.string().optional(),
  // File input is handled separately
});

export type DocumentFormData = z.infer<typeof documentFormSchema>;

interface DocumentUploadFormProps {
  onAddDocument: (data: DocumentFormData, file: File | null) => void;
}

export function DocumentUploadForm({ onAddDocument }: DocumentUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileNameDisplay, setFileNameDisplay] = useState<string>("");

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      name: "",
      documentType: undefined,
      description: "",
    },
  });

  const { formState: { isSubmitting }, reset } = form;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileNameDisplay(file.name);
      if (!form.getValues("name")) { // Prefill name if empty
        form.setValue("name", file.name.split('.').slice(0, -1).join('.'));
      }
    } else {
      setSelectedFile(null);
      setFileNameDisplay("");
    }
  };

  const onSubmit: SubmitHandler<DocumentFormData> = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('documentType', data.documentType);
    formData.append('description', data.description ?? '');
    if (selectedFile) {
      formData.append('file', selectedFile);
    }
    const res = await fetch('/api/vault/docs', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Upload failed');
    onAddDocument(data, selectedFile);
    reset();
    setSelectedFile(null);
    setFileNameDisplay("");
    const fileInput = document.getElementById('documentFileVault') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileUp className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Upload New Document</CardTitle>
        </div>
        <CardDescription>Add a document to the vault. (File upload is safely secured)</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormItem>
              <FormLabel htmlFor="documentFileVault">Choose File (Optional)</FormLabel>
              <FormControl>
                <Input id="documentFileVault" type="file" onChange={handleFileChange} className="text-sm" />
              </FormControl>
              {fileNameDisplay && <p className="text-xs text-muted-foreground mt-1">Selected: {fileNameDisplay}</p>}
               <FormMessage />
            </FormItem>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Insurance Policy 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="DOCX">Word Document (DOCX)</SelectItem>
                      <SelectItem value="TXT">Text File (TXT)</SelectItem>
                      <SelectItem value="JPG">Image (JPG)</SelectItem>
                      <SelectItem value="PNG">Image (PNG)</SelectItem>
                      <SelectItem value="XLSX">Excel Spreadsheet (XLSX)</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Briefly describe the document..." {...field} className="font-code" />
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
                  <UploadCloud className="mr-2 h-4 w-4" /> Add to Vault
                </>
              )}
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
