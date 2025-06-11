
"use client";

import type { VaultDocument } from "@/app/vault/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DownloadCloud, Eye, FileText, FileImage, FileType2, Trash2, ListChecks, FolderArchive, CalendarDays, User, Info } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface DocumentListProps {
  documents: VaultDocument[];
  onDeleteDocument: (documentId: string) => void;
}

const getFileIcon = (fileType: string) => {
  const type = fileType?.toUpperCase();
  if (type === 'PDF') return <FileText className="h-5 w-5 text-red-500" />;
  if (type === 'DOCX' || type === 'DOC') return <FileType2 className="h-5 w-5 text-blue-500" />;
  if (type === 'JPG' || type === 'PNG' || type === 'GIF' || type === 'JPEG') return <FileImage className="h-5 w-5 text-green-500" />;
  if (type === 'XLSX' || type === 'CSV') return <FileType2 className="h-5 w-5 text-emerald-500" />; // Using FileType2 for spreadsheets
  return <FileText className="h-5 w-5 text-muted-foreground" />; // Default icon
};


export function DocumentList({ documents, onDeleteDocument }: DocumentListProps) {
  const { toast } = useToast();

  const handleViewDocument = (docName: string) => {
    toast({
      title: "View Document (Placeholder)",
      description: `Viewing for ${docName} would open here. (Actual viewing not implemented)`,
    });
  };

  const handleDownloadDocument = (docName: string) => {
    toast({
      title: "Download Document (Placeholder)",
      description: `Downloading ${docName}. (Actual download not implemented)`,
    });
  };

  if (documents.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Uploaded Documents</CardTitle>
          </div>
          <CardDescription>No documents found in the vault.</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-10">
          <FolderArchive className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">The vault is empty.</p>
          <p className="text-sm text-muted-foreground">Use the form to add your first document.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ListChecks className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Uploaded Documents</CardTitle>
        </div>
        <CardDescription>Browse and manage documents stored in the vault.</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <ul className="space-y-3">
            {documents.map((doc) => (
              <li key={doc.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border rounded-lg shadow-sm bg-background hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-3 flex-grow">
                  {getFileIcon(doc.type)}
                  <div className="flex-grow">
                    <h3 className="font-semibold text-md">{doc.name}</h3>
                    <div className="text-xs text-muted-foreground space-y-0.5 mt-0.5">
                        <div className="flex items-center gap-1.5">
                            <Badge variant="outline" className="text-xs capitalize">{doc.type}</Badge>
                             <span>&bull;</span>
                            <span>{doc.fileSize}</span>
                        </div>
                         <div className="flex items-center gap-1.5">
                            <CalendarDays className="h-3 w-3"/> 
                            <span>Uploaded: {doc.uploadDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <User className="h-3 w-3" />
                            <span>By: {doc.uploadedBy}</span>
                        </div>
                    </div>
                    {doc.description && (
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                                <p className="mt-1.5 text-xs text-muted-foreground italic flex items-center gap-1.5 cursor-help max-w-md truncate">
                                    <Info className="h-3 w-3 shrink-0" /> {doc.description}
                                </p>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" align="start" className="max-w-sm bg-popover text-popover-foreground p-2 rounded-md shadow-md">
                                <p className="text-xs font-code">{doc.description}</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 mt-3 sm:mt-0 self-start sm:self-center">
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" aria-label={`View ${doc.name}`} onClick={() => handleViewDocument(doc.name)}>
                        <Eye className="h-4 w-4 mr-1 sm:mr-0" /> <span className="sm:hidden">View</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top"><p>View (Placeholder)</p></TooltipContent>
                  </Tooltip>
                  
                  <Tooltip delayDuration={100}>
                     <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" aria-label={`Download ${doc.name}`} onClick={() => handleDownloadDocument(doc.name)}>
                        <DownloadCloud className="h-4 w-4 mr-1 sm:mr-0" /> <span className="sm:hidden">Download</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top"><p>Download (Placeholder)</p></TooltipContent>
                  </Tooltip>

                  <AlertDialog>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" aria-label={`Delete ${doc.name}`}>
                              <Trash2 className="h-4 w-4 mr-1 sm:mr-0" /> <span className="sm:hidden">Delete</span>
                          </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top"><p>Delete Document</p></TooltipContent>
                    </Tooltip>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the document titled "{doc.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDeleteDocument(doc.id)}>
                          Yes, delete document
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
          </ul>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
