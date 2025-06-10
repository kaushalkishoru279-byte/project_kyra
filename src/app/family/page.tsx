import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Placeholder components for Family Network feature
function FamilyMemberForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          Add New Family Member
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Form for adding family member details (name, role, etc.) will be here.</p>
        <Button className="mt-4">Save Member</Button>
      </CardContent>
    </Card>
  );
}

function FamilyMemberList() {
  const members = [
    { id: "1", name: "Alice Smith", role: "Primary Caregiver", avatar: "https://placehold.co/100x100.png" , hint: "woman smiling"},
    { id: "2", name: "Bob Johnson", role: "Family Member", avatar: "https://placehold.co/100x100.png", hint: "man portrait" },
    { id: "3", name: "Dr. Carol White", role: "Doctor", avatar: "https://placehold.co/100x100.png", hint: "doctor professional" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" />
          Registered Family Members
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.map(member => (
          <div key={member.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <Image src={member.avatar} alt={member.name} data-ai-hint={member.hint} width={40} height={40} className="rounded-full" />
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}


export default function FamilyPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Users className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold font-headline tracking-tight">Family Network</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Manage family members, assign roles, and control access to information.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <FamilyMemberForm />
        <FamilyMemberList />
      </div>
    </div>
  );
}
