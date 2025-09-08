
"use client";

import Image from "next/image";
import type { MedicalRecord } from "@/app/records/page"; // Ensure correct path
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Eye, FileText, Tag, Trash2, Files, Info } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface RecordListProps {
  records: MedicalRecord[];
  onDeleteRecord: (recordId: string) => void;
}

export function RecordList({ records, onDeleteRecord }: RecordListProps) {
  const { toast } = useToast();

  const handleDownloadRecord = async (recordId: string, recordName: string) => {
    try {
      const res = await fetch(`/api/records/${recordId}?download=1`);
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = recordName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      toast({ title: 'Download failed', description: 'Unable to download file.' });
    }
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
                      Uploaded: {new Date(record.createdAt).toLocaleString()} | Type: {record.mimeType} | Size: {(record.sizeBytes / (1024 * 1024)).toFixed(2)}MB
                    </p>
                    {record.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {record.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0 mt-2 sm:mt-0">
                    <Dialog>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <DialogTrigger asChild>
                             <Button variant="outline" size="sm" aria-label={`View ${record.name}`}>
                              <Eye className="h-4 w-4 mr-1 sm:mr-0" /> <span className="sm:hidden">View</span>
                            </Button>
                          </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="top"><p>View Record</p></TooltipContent>
                      </Tooltip>
                       <DialogContent className="sm:max-w-3xl">
                        <DialogHeader>
                          <DialogTitle className="font-headline">{record.name}</DialogTitle>
                          <DialogDescription>
                            Uploaded on {new Date(record.createdAt).toLocaleString()} &bull; Type: {record.mimeType} &bull; Size: {(record.sizeBytes / (1024 * 1024)).toFixed(2)}MB
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          {record.mimeType.startsWith('image/') ? (
                            <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={`/api/records/${record.id}`}
                                alt={`Preview of ${record.name}`}
                                className="object-contain w-full h-full"
                              />
                            </div>
                          ) : record.mimeType === 'application/pdf' ? (
                            <div className="rounded-md overflow-hidden" style={{ height: 600 }}>
                              <iframe
                                src={`/api/records/${record.id}`}
                                title={record.name}
                                className="w-full h-full"
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-center bg-muted/50 rounded-lg p-8 h-64">
                              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                              <h3 className="font-semibold text-xl">No Inline Preview</h3>
                              <p className="text-sm text-muted-foreground mb-6">
                                This file type cannot be previewed. You can download it instead.
                              </p>
                              <Button onClick={() => handleDownloadRecord(record.id, record.name)}>
                                <Download className="h-4 w-4 mr-2"/>
                                Download File
                              </Button>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Tooltip delayDuration={100}>
                       <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" aria-label={`Download ${record.name}`} onClick={() => handleDownloadRecord(record.id, record.name)}>
                          <Download className="h-4 w-4 mr-1 sm:mr-0" /> <span className="sm:hidden">Download</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top"><p>Download</p></TooltipContent>
                    </Tooltip>

                    <AlertDialog>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" aria-label={`Delete ${record.name}`}>
                                <Trash2 className="h-4 w-4 mr-1 sm:mr-0" /> <span className="sm:hidden">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
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
