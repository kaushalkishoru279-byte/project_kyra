
'use server';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill, CalendarClock, AlertTriangle } from "lucide-react";
import { MedicationForm, type MedicationFormData } from "@/components/features/medication-tracker/medication-form";
import { MedicationList, type Medication } from "@/components/features/medication-tracker/medication-list";
import { firestore } from "@/lib/firebase";
import { revalidatePath } from "next/cache";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Server Action to get medications
async function getMedications(): Promise<Medication[]> {
  if (!firestore) return [];
  try {
    const snapshot = await firestore.collection('medications').orderBy('name').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Medication));
  } catch (error) {
    console.error("Error fetching medications:", error);
    return [];
  }
}

// Server Action to save (add or update) a medication
async function saveMedication(data: MedicationFormData, id: string | null): Promise<{ success: boolean; message: string }> {
  'use server';
  if (!firestore) return { success: false, message: "Firebase is not configured." };

  try {
    if (id) {
      // Update existing
      await firestore.collection('medications').doc(id).update(data);
      revalidatePath('/medication');
      return { success: true, message: "Medication Updated" };
    } else {
      // Add new
      const newMedication = {
        ...data,
        lastTaken: "Not yet taken",
        nextDue: "Pending schedule",
        takenToday: false,
      };
      await firestore.collection('medications').add(newMedication);
      revalidatePath('/medication');
      return { success: true, message: "Medication Added" };
    }
  } catch (error) {
    console.error("Error saving medication:", error);
    return { success: false, message: "Failed to save medication." };
  }
}

// Server Action to delete a medication
async function deleteMedication(id: string): Promise<{ success: boolean; message: string }> {
  'use server';
  if (!firestore) return { success: false, message: "Firebase is not configured." };

  try {
    await firestore.collection('medications').doc(id).delete();
    revalidatePath('/medication');
    return { success: true, message: "Medication Deleted" };
  } catch (error) {
    console.error("Error deleting medication:", error);
    return { success: false, message: "Failed to delete medication." };
  }
}

// Server Action to toggle taken status
async function toggleMedicationTaken(id: string, currentState: Medication): Promise<{ success: boolean; message: string }> {
  'use server';
  if (!firestore) return { success: false, message: "Firebase is not configured." };
  try {
    const newTakenStatus = !currentState.takenToday;
    const newLastTaken = newTakenStatus 
      ? `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
      : currentState.lastTaken; // This logic could be more sophisticated

    await firestore.collection('medications').doc(id).update({
      takenToday: newTakenStatus,
      lastTaken: newLastTaken,
    });
    revalidatePath('/medication');
    return { success: true, message: "Status Updated" };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, message: "Failed to update status." };
  }
}


export default async function MedicationPage() {
  const isFirestoreConfigured = !!firestore;
  const medications = isFirestoreConfigured ? await getMedications() : [];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Pill className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold font-headline tracking-tight">Medication Tracker</h1>
      </div>
       <p className="text-lg text-muted-foreground">
        Keep track of medications, dosages, and schedules. Your data is now saved to the database.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <MedicationForm
            onSaveMedication={saveMedication}
          />
        </div>
        <div className="lg:col-span-2">
          <MedicationList
            medications={medications}
            onDelete={deleteMedication}
            onToggleTaken={toggleMedicationTaken}
            onSave={saveMedication}
          />
        </div>
      </div>
       <Card className="mt-8 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-primary"/>
            <CardTitle className="font-headline">Upcoming Doses & Alerts</CardTitle>
          </div>
          <CardDescription>View upcoming medication schedule and any missed dose alerts.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Real-time intake tracking and alerts for missed doses will be displayed here. (Functionality to be implemented)</p>
        </CardContent>
      </Card>
    </div>
  );
}
