"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud } from "lucide-react";

export function RecordUpload() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UploadCloud className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Upload New Record</CardTitle>
        </div>
        <CardDescription>Add a new medical report or document.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="recordFile">Choose File</Label>
          <Input id="recordFile" type="file" />
          <p className="text-xs text-muted-foreground mt-1">Supported formats: PDF, JPG, PNG. Max size: 5MB.</p>
        </div>
        <div>
          <Label htmlFor="recordName">Document Name / Title</Label>
          <Input id="recordName" placeholder="e.g., Blood Test Results - Jan 2024" />
        </div>
        <div>
          <Label htmlFor="recordTags">Tags (comma-separated)</Label>
          <Input id="recordTags" placeholder="e.g., blood test, cardiology, annual checkup" />
        </div>
        <Button className="w-full mt-2">
          Upload Record
        </Button>
      </CardContent>
    </Card>
  );
}
