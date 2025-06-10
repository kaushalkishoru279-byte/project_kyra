
"use client";

import { useState } from 'react';
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

const initialCustomContacts: CustomEmergencyContact[] = [
  { id: "custom1", emergencyType: "House Fire", contactName: "Local Fire Department", contactPhone: "555-0303", tag: "Station 1" },
  { id: "custom2", emergencyType: "Power Outage", contactName: "Utility Company", contactPhone: "555-0404", tag: "24/7 Line" },
];


export default function EmergencyPage() {
  const [customContacts, setCustomContacts] = useState<CustomEmergencyContact[]>(initialCustomContacts);
  const { toast } = useToast();

  const handleAddCustomContact = (data: CustomEmergencyContactFormData) => {
    const newContact: CustomEmergencyContact = {
      id: Date.now().toString(),
      emergencyType: data.emergencyType,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      tag: data.tag,
    };
    setCustomContacts(prev => [newContact, ...prev]);
    toast({
      title: "Custom Contact Added",
      description: `${newContact.contactName} for ${newContact.emergencyType} has been added.`,
    });
  };

  const handleDeleteCustomContact = (contactId: string) => {
    const contactToDelete = customContacts.find(c => c.id === contactId);
    setCustomContacts(prev => prev.filter(contact => contact.id !== contactId));
    if (contactToDelete) {
      toast({
        title: "Custom Contact Removed",
        description: `${contactToDelete.contactName} has been removed.`,
        variant: "destructive",
      });
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
