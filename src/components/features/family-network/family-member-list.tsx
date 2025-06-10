"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, Edit3, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const familyMembers = [
  { id: "1", name: "Eleanor Vance", role: "Primary Caregiver", avatar: "https://placehold.co/80x80.png", hint: "woman portrait" },
  { id: "2", name: "Dr. Arthur Green", role: "Doctor", avatar: "https://placehold.co/80x80.png", hint: "doctor smiling" },
  { id: "3", name: "Samuel Page", role: "Family Member", avatar: "https://placehold.co/80x80.png", hint: "man glasses" },
];

export function FamilyMemberList() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ListChecks className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Family & Care Team</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {familyMembers.length > 0 ? (
          <ul className="space-y-4">
            {familyMembers.map((member) => (
              <li key={member.id} className="flex items-center justify-between gap-4 p-4 border rounded-lg shadow-sm bg-background hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Image src={member.avatar} alt={member.name} data-ai-hint={member.hint} width={50} height={50} className="rounded-full" />
                  <div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <Badge variant="secondary" className="mt-1">{member.role}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" aria-label="Edit member">
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" aria-label="Remove member">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-center py-4">No family members added yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
