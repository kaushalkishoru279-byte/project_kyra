"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Eye, FileText, Tag, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const records = [
  { id: "1", name: "Annual Checkup Report - 2023", date: "2023-11-15", type: "PDF", tags: ["annual", "bloodwork"], size: "1.2MB" },
  { id: "2", name: "X-Ray Results - Left Knee", date: "2024-01-20", type: "JPG", tags: ["xray", "orthopedics"], size: "800KB" },
  { id: "3", name: "Cardiology Consultation Notes", date: "2024-02-10", type: "PDF", tags: ["cardiology", "consultation"], size: "450KB" },
];

export function RecordList() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Uploaded Records</CardTitle>
        </div>
        <CardDescription>Access and manage all stored medical documents.</CardDescription>
      </CardHeader>
      <CardContent>
        {records.length > 0 ? (
          <ul className="space-y-3">
            {records.map((record) => (
              <li key={record.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border rounded-lg shadow-sm bg-background hover:bg-muted/50 transition-colors">
                <div className="flex-grow">
                  <h3 className="font-semibold text-md">{record.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    Uploaded: {record.date} | Type: {record.type} | Size: {record.size}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {record.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 mt-2 sm:mt-0">
                  <Button variant="outline" size="sm" aria-label={`View ${record.name}`}>
                    <Eye className="h-4 w-4 mr-1 sm:mr-0" /> <span className="sm:hidden">View</span>
                  </Button>
                  <Button variant="outline" size="sm" aria-label={`Download ${record.name}`}>
                    <Download className="h-4 w-4 mr-1 sm:mr-0" /> <span className="sm:hidden">Download</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" aria-label={`Delete ${record.name}`}>
                    <Trash2 className="h-4 w-4 mr-1 sm:mr-0" /> <span className="sm:hidden">Delete</span>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-center py-4">No medical records uploaded yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
