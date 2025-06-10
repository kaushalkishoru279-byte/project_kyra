import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, UploadCloud, Search, Tag } from "lucide-react";
import { RecordUpload } from "@/components/features/medical-records/record-upload";
import { RecordList } from "@/components/features/medical-records/record-list";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MedicalRecordsPage() {
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
          <RecordUpload />
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
            <CardContent className="flex gap-2">
              <Input placeholder="Search records..." className="flex-grow" />
              <Button variant="outline">
                <Tag className="h-4 w-4 mr-2"/> Filter by Tags
              </Button>
            </CardContent>
          </Card>
          <div className="mt-8">
            <RecordList />
          </div>
        </div>
      </div>
    </div>
  );
}
