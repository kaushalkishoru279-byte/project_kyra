
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileArchive, UploadCloud, ListChecks } from "lucide-react";
import { DocumentUploadForm, type DocumentFormData } from "@/components/features/document-vault/document-upload-form";
import { DocumentList } from "@/components/features/document-vault/document-list";
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

export interface VaultDocument {
  id: string;
  name: string;
  type?: string;
  description?: string;
  createdAt: string;
  sizeBytes: number;
}

export default function DocumentVaultPage() {
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const { toast } = useToast();

  const loadDocs = async () => {
    const res = await fetch('/api/vault/docs', { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    setDocuments(data as VaultDocument[]);
  };

  useEffect(() => {
    void loadDocs();
  }, []);

  const handleAddDocument = async (_data: DocumentFormData, _file: File | null) => {
    await loadDocs();
    toast({ title: 'Document Added', description: 'Your document has been securely stored.' });
  };

  const handleDeleteDocument = async (documentId: string) => {
    const res = await fetch(`/api/vault/docs/${documentId}`, { method: 'DELETE' });
    if (res.ok) {
      await loadDocs();
      toast({ title: 'Document Deleted', description: 'The document has been removed.', variant: 'destructive' });
    } else {
      toast({ title: 'Delete failed', description: 'Unable to delete document.', variant: 'destructive' });
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
