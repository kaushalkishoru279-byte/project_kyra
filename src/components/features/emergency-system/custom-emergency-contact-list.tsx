
"use client";

import type { CustomEmergencyContact } from "@/app/emergency/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Tag, Trash2, ListChecks, ShieldQuestion } from "lucide-react";
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

interface CustomEmergencyContactListProps {
  contacts: CustomEmergencyContact[];
  onDeleteCustomContact: (contactId: string) => void;
}

export function CustomEmergencyContactList({ contacts, onDeleteCustomContact }: CustomEmergencyContactListProps) {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <ShieldQuestion className="h-10 w-10 mx-auto mb-2 text-primary/50" />
        <p>No custom emergency contacts added yet.</p>
        <p className="text-sm">Use the form above to add contacts for specific scenarios.</p>
      </div>
    );
  }

  return (
    <div>
        <div className="flex items-center gap-2 mb-4">
            <ListChecks className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Your Custom Contacts</h3>
        </div>
        <TooltipProvider>
        <ul className="space-y-3">
            {contacts.map((contact) => (
            <li key={contact.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border rounded-lg shadow-sm bg-background hover:bg-muted/50 transition-colors">
                <div className="flex-grow">
                <Badge variant="outline" className="mb-1 capitalize bg-accent/20 border-accent/50 text-accent-foreground/80">{contact.emergencyType}</Badge>
                <h4 className="font-semibold text-md">{contact.contactName}</h4>
                <a href={`tel:${contact.contactPhone}`} className="flex items-center gap-1 text-sm text-accent hover:underline">
                    <Phone className="h-3 w-3" />
                    {contact.contactPhone}
                </a>
                {contact.tag && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Tag className="h-3 w-3" />
                    <span>{contact.tag}</span>
                    </div>
                )}
                </div>
                <div className="shrink-0 mt-2 sm:mt-0">
                <AlertDialog>
                    <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" aria-label={`Remove ${contact.contactName}`}>
                            <Trash2 className="h-4 w-4 mr-1 sm:mr-0" /> <span className="sm:hidden">Remove</span>
                        </Button>
                        </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top"><p>Remove Contact</p></TooltipContent>
                    </Tooltip>
                    <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                        This action cannot be undone. This will permanently remove the contact "{contact.contactName}" for "{contact.emergencyType}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDeleteCustomContact(contact.id)}>
                        Yes, remove contact
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </div>
            </li>
            ))}
        </ul>
        </TooltipProvider>
    </div>
  );
}
