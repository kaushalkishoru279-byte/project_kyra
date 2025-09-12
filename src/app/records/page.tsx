
"use client";

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, UploadCloud, Search, Tag, Users2, X, Filter } from "lucide-react";
import { RecordUpload, type RecordFormData } from "@/components/features/medical-records/record-upload";
import { RecordList } from "@/components/features/medical-records/record-list";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date");
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

  // Get unique tags from all records
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    records.forEach(record => record.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [records]);

  // Filter and sort records
  const filteredRecords = useMemo(() => {
    let filtered = records.filter(record => {
      const matchesSearch = !searchTerm || 
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTag = !selectedTag || record.tags.includes(selectedTag);
      
      return matchesSearch && matchesTag;
    });

    // Sort records
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "size":
          return b.sizeBytes - a.sizeBytes;
        case "date":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [records, searchTerm, selectedTag, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTag("");
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
              <CardDescription>Find records by name, date, or tags.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input 
                  placeholder="Search by name or tags..." 
                  className="flex-grow" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={selectedTag || "__all__"} onValueChange={(v) => setSelectedTag(v === "__all__" ? "" : v)}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All tags</SelectItem>
                    {allTags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(value: "name" | "date" | "size") => setSortBy(value)}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Newest</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="size">Size</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {(searchTerm || selectedTag) && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  <span>
                    Showing {filteredRecords.length} of {records.length} records
                    {searchTerm && ` matching "${searchTerm}"`}
                    {selectedTag && ` with tag "${selectedTag}"`}
                  </span>
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2">
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="mt-8">
            <RecordList records={filteredRecords} onDeleteRecord={handleDeleteRecord} />
          </div>
        </div>
      </div>
    </div>
  );
}
