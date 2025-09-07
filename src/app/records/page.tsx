
"use client";

import { useState } from 'react';
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
  date: string; // Store as ISO string or formatted string
  type: string; // e.g., PDF, JPG
  tags: string[];
  size: string; // e.g., 1.2MB
  previewUrl?: string; // For image previews
  // In a real app, you'd have a file path or URL here
}

const initialRecords: MedicalRecord[] = [
  { id: "1", name: "Annual Checkup Report - 2023", date: new Date(2023, 10, 15).toLocaleDateString(), type: "PDF", tags: ["annual", "bloodwork"], size: "1.2MB" },
  { id: "2", name: "X-Ray Results - Left Knee", date: new Date(2024, 0, 20).toLocaleDateString(), type: "JPG", tags: ["xray", "orthopedics"], size: "800KB", previewUrl: "https://picsum.photos/seed/xray/800/600" },
  { id: "3", name: "Cardiology Consultation Notes", date: new Date(2024, 1, 10).toLocaleDateString(), type: "PDF", tags: ["cardiology", "consultation"], size: "450KB" },
];


export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>(initialRecords);
  const { toast } = useToast();

  const handleAddRecord = (data: RecordFormData, fileInfo: { type: string; size: string; dataUrl?: string }) => {
    const newRecord: MedicalRecord = {
      id: Date.now().toString(),
      name: data.name,
      date: new Date().toLocaleDateString(), // Use current date for new uploads
      type: fileInfo.type,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      size: fileInfo.size,
      previewUrl: fileInfo.dataUrl,
    };
    setRecords(prevRecords => [newRecord, ...prevRecords]);
    toast({
      title: "Record Uploaded",
      description: `${newRecord.name} has been successfully added. (Simulated)`,
    });
  };

  const handleDeleteRecord = (recordId: string) => {
    const recordToDelete = records.find(r => r.id === recordId);
    setRecords(prevRecords => prevRecords.filter(record => record.id !== recordId));
    if (recordToDelete) {
      toast({
        title: "Record Deleted",
        description: `${recordToDelete.name} has been deleted.`,
        variant: "destructive",
      });
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
