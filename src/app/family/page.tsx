
"use client";

import { useState } from 'react';
import { Users, UserPlus, ListChecks } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FamilyMemberForm, type FamilyMemberFormData } from "@/components/features/family-network/family-member-form";
import { FamilyMemberList } from "@/components/features/family-network/family-member-list";
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  avatarHint: string;
}

const initialMembers: FamilyMember[] = [
  { id: "1", name: "Eleanor Vance", role: "Primary Caregiver", email: "eleanor@example.com", avatar: "https://placehold.co/80x80.png", avatarHint: "woman portrait" },
  { id: "2", name: "Dr. Arthur Green", role: "Doctor", email: "dr.green@example.com", avatar: "https://placehold.co/80x80.png", avatarHint: "doctor smiling" },
  { id: "3", name: "Samuel Page", role: "Family Member", email: "sam.page@example.com", avatar: "https://placehold.co/80x80.png", avatarHint: "man glasses" },
];

export default function FamilyPage() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialMembers);
  const { toast } = useToast();

  const handleAddMember = (data: FamilyMemberFormData) => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: data.name,
      role: data.role,
      email: data.email,
      avatar: "https://placehold.co/80x80.png", // Default avatar
      avatarHint: "person placeholder", // Default hint
    };
    setFamilyMembers(prevMembers => [newMember, ...prevMembers]);
    toast({
      title: "Family Member Added",
      description: `${newMember.name} has been added to your network.`,
    });
  };

  const handleDeleteMember = (memberId: string) => {
    const memberToDelete = familyMembers.find(m => m.id === memberId);
    setFamilyMembers(prevMembers => prevMembers.filter(member => member.id !== memberId));
    if (memberToDelete) {
      toast({
        title: "Family Member Removed",
        description: `${memberToDelete.name} has been removed from your network.`,
        variant: "destructive",
      });
    }
  };

  const handleEditMember = (memberId: string) => {
    const memberToEdit = familyMembers.find(m => m.id === memberId);
    // For now, just log or show a toast. Full edit functionality can be added later.
    toast({
      title: "Edit Action (Placeholder)",
      description: `Editing ${memberToEdit?.name}. Full functionality to be implemented.`,
    });
    console.log("Attempting to edit member:", memberId);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Users className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold font-headline tracking-tight">Family Network</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Manage family members, assign roles, and control access to information.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1">
          <FamilyMemberForm onAddMember={handleAddMember} />
        </div>
        <div className="md:col-span-2">
          <FamilyMemberList
            members={familyMembers}
            onEditMember={handleEditMember}
            onDeleteMember={handleDeleteMember}
          />
        </div>
      </div>
    </div>
  );
}
