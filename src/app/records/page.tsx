
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, UploadCloud, Search, Tag, Users2 } from "lucide-react";
import { RecordUpload, type RecordFormData } from "@/components/features/medical-records/record-upload";
import { RecordList } from "@/components/features/medical-records/record-list";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface MedicalRecord {
  id: string;
  name: string;
  createdAt: string;
  mimeType: string;
  tags: string[];
  sizeBytes: number;
}


export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const { toast } = useToast();

  const loadRecords = async () => {
    const res = await fetch('/api/records', { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    setRecords(data as MedicalRecord[]);
  };

  useEffect(() => {
    void loadRecords();
  }, []);

  const handleAddRecord = async (_data: RecordFormData, _fileInfo: { type: string; size: string; dataUrl?: string }) => {
    await loadRecords();
    toast({
      title: "Record Uploaded",
      description: `Your document has been uploaded successfully.`,
    });
  };

  const handleDeleteRecord = async (recordId: string) => {
    const res = await fetch(`/api/records/${recordId}`, { method: 'DELETE' });
    if (res.ok) {
      await loadRecords();
      toast({
        title: "Record Deleted",
        description: `The record has been deleted.`,
        variant: "destructive",
      });
    } else {
      toast({ title: 'Delete failed', description: 'Unable to delete record.', variant: 'destructive' });
    }
  };

  // Placeholder for search functionality
  const handleSearch = (searchTerm: string) => {
    console.log("Searching for:", searchTerm);
    // Implement actual search logic here if needed
    toast({
      title: "Search (Placeholder)",
      description: "Search functionality is not yet implemented.",
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <FileText className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold font-headline tracking-tight">Medical Records</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Securely store, view, and manage health reports and medical documents.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1">
          <RecordUpload onAddRecord={handleAddRecord} />
        </div>
        <div className="md:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Search className="h-6 w-6 text-primary" />
                <CardTitle className="font-headline">Search & Filter Records</CardTitle>
              </div>
              <CardDescription>Find records by name, date, or tags. (Placeholder)</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-2">
              <Input 
                placeholder="Search records..." 
                className="flex-grow" 
                onChange={(e) => { /* Debounce this in a real app */ }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch((e.target as HTMLInputElement).value);}}
              />
              <Button variant="outline" onClick={() => toast({ title: "Filter (Placeholder)", description: "Tag filtering not implemented."})}>
                <Tag className="h-4 w-4 mr-2"/> Filter by Tags
              </Button>
            </CardContent>
          </Card>
          <div className="mt-8">
            <RecordList records={records} onDeleteRecord={handleDeleteRecord} />
          </div>
        </div>
      </div>
    </div>
  );
}
