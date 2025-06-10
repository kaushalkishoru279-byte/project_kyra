
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ListChecks, Edit3, Trash2, Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { FamilyMember } from "@/app/family/page"; // Ensure correct path to type
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


interface FamilyMemberListProps {
  members: FamilyMember[];
  onEditMember: (memberId: string) => void;
  onDeleteMember: (memberId: string) => void;
}

export function FamilyMemberList({ members, onEditMember, onDeleteMember }: FamilyMemberListProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ListChecks className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Family & Care Team</CardTitle>
        </div>
        <CardDescription>View and manage registered members.</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          {members.length > 0 ? (
            <ul className="space-y-4">
              {members.map((member) => (
                <li key={member.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border rounded-lg shadow-sm bg-background hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4 flex-grow">
                    <Image 
                      src={member.avatar} 
                      alt={member.name} 
                      data-ai-hint={member.avatarHint} 
                      width={50} 
                      height={50} 
                      className="rounded-full object-cover" 
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-xs text-muted-foreground mb-1">{member.email}</p>
                      <Badge variant="secondary">{member.role}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0 mt-2 sm:mt-0">
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" aria-label={`Edit ${member.name}`} onClick={() => onEditMember(member.id)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top"><p>Edit Member</p></TooltipContent>
                    </Tooltip>

                    <AlertDialog>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" aria-label={`Remove ${member.name}`}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="top"><p>Remove Member</p></TooltipContent>
                      </Tooltip>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently remove {member.name} from your family network.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDeleteMember(member.id)}>
                            Yes, remove member
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
              <Users2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No family members added yet.</p>
              <p className="text-sm text-muted-foreground">Use the form to add your first member.</p>
            </div>
          )}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
