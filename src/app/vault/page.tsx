
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileArchive, UploadCloud, ListChecks } from "lucide-react";
import { DocumentUploadForm, type DocumentFormData } from "@/components/features/document-vault/document-upload-form";
import { DocumentList } from "@/components/features/document-vault/document-list";
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

export interface VaultDocument {
  id: string;
  name: string;
  type: string; // e.g., PDF, DOCX, JPG, PNG
  description?: string;
  uploadDate: string; // Store as ISO string or formatted string
  uploadedBy: string; // User name or ID
  fileSize: string; // e.g., 1.2MB (simulated)
  // In a real app, you'd have a file path or URL here
}

// Mock initial documents for demonstration
const initialDocuments: VaultDocument[] = [
  { id: "doc1", name: "Home Insurance Policy 2024", type: "PDF", description: "Updated home insurance coverage.", uploadDate: new Date(2024, 0, 15).toLocaleDateString(), uploadedBy: "Eleanor Vance", fileSize: "2.1MB" },
  { id: "doc2", name: "Mom's Birth Certificate", type: "JPG", uploadDate: new Date(2023, 11, 5).toLocaleDateString(), uploadedBy: "Samuel Page", fileSize: "850KB" },
  { id: "doc3", name: "Emergency Contact List", type: "DOCX", description: "Key contacts for various emergencies.", uploadDate: new Date(2024, 1, 20).toLocaleDateString(), uploadedBy: "Eleanor Vance", fileSize: "120KB" },
];

export default function DocumentVaultPage() {
  const [documents, setDocuments] = useState<VaultDocument[]>(initialDocuments);
  const { toast } = useToast();

  const handleAddDocument = (data: DocumentFormData, file: File | null) => {
    const newDocument: VaultDocument = {
      id: Date.now().toString(),
      name: data.name,
      type: data.documentType,
      description: data.description,
      uploadDate: new Date().toLocaleDateString(),
      uploadedBy: "Current User", // Placeholder for logged-in user
      fileSize: file ? `${(file.size / (1024 * 1024)).toFixed(2)}MB` : `${(Math.random() * 3 + 0.5).toFixed(1)}MB` // Simulated if no file
    };
    setDocuments(prevDocs => [newDocument, ...prevDocs]);
    toast({
      title: "Document Added",
      description: `${newDocument.name} has been (simulated) uploaded to the vault.`,
    });
  };

  const handleDeleteDocument = (documentId: string) => {
    const docToDelete = documents.find(d => d.id === documentId);
    setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentId));
    if (docToDelete) {
      toast({
        title: "Document Deleted",
        description: `${docToDelete.name} has been removed from the vault.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <FileArchive className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold font-headline tracking-tight">Secure Document Vault</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Safely store and manage important family documents like policies, IDs, and medical papers.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1">
          <DocumentUploadForm onAddDocument={handleAddDocument} />
        </div>
        <div className="md:col-span-2">
          <DocumentList documents={documents} onDeleteDocument={handleDeleteDocument} />
        </div>
      </div>
    </div>
  );
}
