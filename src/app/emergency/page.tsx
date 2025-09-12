
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Siren, PhoneCall, Hospital, MapPin, ShieldAlert, ShieldPlus, ListChecks } from "lucide-react";
import { ContactInfo } from "@/components/features/emergency-system/contact-info";
import { NearbyHospitals } from "@/components/features/emergency-system/nearby-hospitals";
import { EmergencyCallButton } from "@/components/features/emergency-system/emergency-call-button";
import { CustomEmergencyContactForm, type CustomEmergencyContactFormData } from "@/components/features/emergency-system/custom-emergency-contact-form";
import { CustomEmergencyContactList } from "@/components/features/emergency-system/custom-emergency-contact-list";
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

export interface CustomEmergencyContact {
  id: string;
  emergencyType: string;
  contactName: string;
  contactPhone: string;
  tag?: string;
}

const headers = { 'X-User-Id': 'demo-user', 'Content-Type': 'application/json' } as any;


export default function EmergencyPage() {
  const [customContacts, setCustomContacts] = useState<CustomEmergencyContact[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/emergency/contacts', { headers, cache: 'no-store' });
        if (!res.ok) throw new Error('load failed');
        const data = await res.json();
        setCustomContacts(data);
      } catch {
        setCustomContacts([]);
      }
    };
    void load();
  }, []);

  const handleAddCustomContact = async (data: CustomEmergencyContactFormData) => {
    try {
      const res = await fetch('/api/emergency/contacts', { method: 'POST', headers, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('create failed');
      toast({ title: "Custom Contact Added", description: `${data.contactName} for ${data.emergencyType} has been added.` });
      const reload = await fetch('/api/emergency/contacts', { headers, cache: 'no-store' });
      setCustomContacts(reload.ok ? await reload.json() : []);
    } catch {
      toast({ title: "Failed to add contact", variant: "destructive" });
    }
  };

  const handleDeleteCustomContact = async (contactId: string) => {
    const contactToDelete = customContacts.find(c => c.id === contactId);
    try {
      const res = await fetch(`/api/emergency/contacts?id=${encodeURIComponent(contactId)}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error('delete failed');
      toast({ title: "Custom Contact Removed", description: contactToDelete ? `${contactToDelete.contactName} has been removed.` : undefined, variant: "destructive" });
      const reload = await fetch('/api/emergency/contacts', { headers, cache: 'no-store' });
      setCustomContacts(reload.ok ? await reload.json() : []);
    } catch {
      toast({ title: "Failed to remove contact", variant: "destructive" });
    }
  };


  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Siren className="h-10 w-10 text-destructive" />
        <h1 className="text-4xl font-bold font-headline tracking-tight">Emergency System</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Quick access to emergency contacts, medical information, and local services. Add custom contacts for specific scenarios.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EmergencyCallButton />
        <ContactInfo />
        <NearbyHospitals />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldPlus className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Manage Custom Emergency Contacts</CardTitle>
          </div>
          <CardDescription>Add contacts for specific emergency scenarios like fire, flood, etc.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CustomEmergencyContactForm onAddCustomContact={handleAddCustomContact} />
          <Separator />
          <CustomEmergencyContactList
            contacts={customContacts}
            onDeleteCustomContact={handleDeleteCustomContact}
          />
        </CardContent>
      </Card>


      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">General Emergency Protocol</CardTitle>
          </div>
          <CardDescription>Important steps to take during any emergency.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground font-code">
            <li>Stay calm and assess the situation.</li>
            <li>If safe, provide immediate first aid.</li>
            <li>Call emergency services using the main call button or dialing your local emergency number.</li>
            <li>Provide clear information: location, nature of emergency, number of people involved.</li>
            <li>Contact designated family members or doctor.</li>
            <li>Have important medical information ready (see Medical Records).</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
