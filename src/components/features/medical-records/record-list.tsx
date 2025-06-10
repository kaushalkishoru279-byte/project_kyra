
"use client";

import type { MedicalRecord } from "@/app/records/page"; // Ensure correct path
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Eye, FileText, Tag, Trash2, Files } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface RecordListProps {
  records: MedicalRecord[];
  onDeleteRecord: (recordId: string) => void;
}

export function RecordList({ records, onDeleteRecord }: RecordListProps) {
  const { toast } = useToast();

  const handleViewRecord = (recordName: string) => {
    toast({
      title: "View Record (Placeholder)",
      description: `Viewing for ${recordName} would open here. (Not implemented)`,
    });
  };

  const handleDownloadRecord = (recordName: string) => {
    toast({
      title: "Download Record (Placeholder)",
      description: `Downloading for ${recordName} would start here. (Not implemented)`,
    });
  };

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
        <TooltipProvider>
          {records.length > 0 ? (
            <ul className="space-y-3">
              {records.map((record) => (
                <li key={record.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border rounded-lg shadow-sm bg-background hover:bg-muted/50 transition-colors">
                  <div className="flex-grow">
                    <h3 className="font-semibold text-md">{record.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Uploaded: {record.date} | Type: {record.type} | Size: {record.size}
                    </p>
                    {record.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {record.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0 mt-2 sm:mt-0">
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" aria-label={`View ${record.name}`} onClick={() => handleViewRecord(record.name)}>
                          <Eye className="h-4 w-4 mr-1 sm:mr-0" /> <span className="sm:hidden">View</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top"><p>View Record (Placeholder)</p></TooltipContent>
                    </Tooltip>
                    
                    <Tooltip delayDuration={100}>
                       <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" aria-label={`Download ${record.name}`} onClick={() => handleDownloadRecord(record.name)}>
                          <Download className="h-4 w-4 mr-1 sm:mr-0" /> <span className="sm:hidden">Download</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top"><p>Download Record (Placeholder)</p></TooltipContent>
                    </Tooltip>

                    <AlertDialog>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" aria-label={`Delete ${record.name}`}>
                                <Trash2 className="h-4 w-4 mr-1 sm:mr-0" /> <span className="sm:hidden">Delete</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top"><p>Delete Record</p></TooltipContent>
                      </Tooltip>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the record titled "{record.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDeleteRecord(record.id)}>
                            Yes, delete record
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10">
                <Files className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No medical records uploaded yet.</p>
                <p className="text-sm text-muted-foreground">Use the form to add your first record.</p>
            </div>
          )}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
