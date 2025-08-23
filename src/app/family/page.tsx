
'use server';

import { Users, AlertTriangle } from "lucide-react";
import { FamilyMemberForm, type FamilyMemberFormData } from "@/components/features/family-network/family-member-form";
import { FamilyMemberList } from "@/components/features/family-network/family-member-list";
import { firestore } from "@/lib/firebase";
import { revalidatePath } from "next/cache";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  avatarHint: string;
}

// Server Action to add a family member
async function addFamilyMember(data: FamilyMemberFormData) {
  'use server';
  if (!firestore) {
    return { success: false, message: "Firebase is not configured. Please check your server setup." };
  }
  try {
    const newMember = {
      name: data.name,
      role: data.role,
      email: data.email,
      avatar: "https://placehold.co/80x80.png", // Default avatar
      avatarHint: "person placeholder", // Default hint
    };
    await firestore.collection('familyMembers').add(newMember);
    revalidatePath('/family'); // This tells Next.js to refetch the data on the page
    return { success: true, message: "Family Member Added" };
  } catch (error) {
    console.error("Error adding family member:", error);
    return { success: false, message: "Failed to add member. Please try again." };
  }
}

// Server Action to delete a family member
async function deleteFamilyMember(memberId: string) {
  'use server';
   if (!firestore) {
    return { success: false, message: "Firebase is not configured. Please check your server setup." };
  }
  try {
    await firestore.collection('familyMembers').doc(memberId).delete();
    revalidatePath('/family');
    return { success: true, message: "Family Member Removed" };
  } catch (error) {
    console.error("Error deleting family member:", error);
    return { success: false, message: "Failed to remove member. Please try again." };
  }
}

// Server Action to edit a family member (placeholder)
async function editFamilyMember(memberId: string) {
    'use server';
    console.log("Attempting to edit member:", memberId);
    // In a real implementation, you would fetch the member, open a form with their data,
    // and then have another server action to update the data in Firestore.
    return { success: true, message: `Edit action for ${memberId} initiated. (Not fully implemented)` };
}


// The main page component, now fetches data directly
export default async function FamilyPage() {
  
  let familyMembers: FamilyMember[] = [];
  let isFirestoreConfigured = !!firestore;

  if (isFirestoreConfigured) {
    const familyMembersSnapshot = await firestore.collection('familyMembers').get();
    familyMembers = familyMembersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FamilyMember));
  } else {
    console.log("Firestore is not initialized. Skipping data fetch for FamilyPage.");
  }


  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Users className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold font-headline tracking-tight">Family Network</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Manage family members, assign roles, and control access to information. Your data is now saved to a database.
      </p>

      {!isFirestoreConfigured && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Firebase Not Configured</AlertTitle>
          <AlertDescription>
            The backend is not connected. Please provide your Firebase project credentials in the environment variables to enable database functionality.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1">
          <FamilyMemberForm onAddMember={addFamilyMember} />
        </div>
        <div className="md:col-span-2">
          <FamilyMemberList
            members={familyMembers}
            onEditMember={editFamilyMember}
            onDeleteMember={deleteFamilyMember}
          />
        </div>
      </div>
    </div>
  );
}
