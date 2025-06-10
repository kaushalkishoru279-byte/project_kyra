"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserCircle, Phone } from "lucide-react";

const contacts = [
  { name: "Dr. Evelyn Reed (Cardiologist)", phone: "555-0101", hint: "doctor profile" },
  { name: "Sarah Miller (Primary Contact)", phone: "555-0202", hint: "woman friendly" },
];

export function ContactInfo() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserCircle className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Key Contacts</CardTitle>
        </div>
        <CardDescription>Important phone numbers for quick access.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {contacts.map(contact => (
          <div key={contact.name} className="p-3 border rounded-md bg-muted/30">
            <h4 className="font-semibold">{contact.name}</h4>
            <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-sm text-accent hover:underline">
              <Phone className="h-4 w-4" />
              {contact.phone}
            </a>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
