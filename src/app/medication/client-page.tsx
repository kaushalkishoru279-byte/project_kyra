"use client";

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "lucide-react";
import { MedicationForm, type MedicationFormData } from "@/components/features/medication-tracker/medication-form";
import { MedicationList, type Medication } from "@/components/features/medication-tracker/medication-list";

export function MedicationClientPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const headers = { 'X-User-Id': 'demo-user', 'Content-Type': 'application/json' };

  const load = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch('/api/medications', { headers, cache: 'no-store' });
    const data = res.ok ? await res.json() : [];
    setMedications(data);
    setIsLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const saveMedication = async (data: MedicationFormData, id: string | null) => {
    const res = await fetch('/api/medications', { method: 'POST', headers, body: JSON.stringify({ id, ...data }) });
    if (res.ok) {
      const json = await res.json();
      const medId = json.id as string | undefined;
      // Create a schedule if scheduleTime provided and new medication created
      if (!id && medId && data.scheduleTime) {
        const rule = { times: [data.scheduleTime] };
        await fetch('/api/medications/schedules', { method: 'POST', headers, body: JSON.stringify({ medicationId: medId, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, rule, startDate: new Date().toISOString().slice(0,10) }) });
        // Generate next 14 days
        const listRes = await fetch('/api/medications/schedules', { headers });
        const schedules = listRes.ok ? await listRes.json() : [];
        const sched = (schedules as any[]).find(s => s.medication_id === medId);
        if (sched) {
          await fetch('/api/medications/reminders/generate', { method: 'POST', headers, body: JSON.stringify({ scheduleId: sched.id, days: 14 }) });
        }
      }
      await load();
      return { success: true, message: id ? 'Medication Updated' : 'Medication Added' };
    }
    return { success: false, message: 'Failed to save medication.' };
  };

  const deleteMedication = async (id: string) => {
    const res = await fetch(`/api/medications?id=${encodeURIComponent(id)}`, { method: 'DELETE', headers });
    if (res.ok) { await load(); return { success: true, message: 'Medication Deleted' }; }
    return { success: false, message: 'Failed to delete medication.' };
  };

  const toggleMedicationTaken = async (id: string, currentState: Medication) => {
    const takenToday = !currentState.takenToday;
    const lastTaken = takenToday ? `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : currentState.lastTaken;
    const res = await fetch('/api/medications', { method: 'PATCH', headers, body: JSON.stringify({ id, takenToday, lastTaken }) });
    if (res.ok) { await load(); return { success: true, message: 'Status Updated' }; }
    return { success: false, message: 'Failed to update status.' };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <MedicationForm onSaveMedication={saveMedication} />
      </div>
      <div className="lg:col-span-2">
        <MedicationList medications={medications} onDelete={deleteMedication} onToggleTaken={toggleMedicationTaken} onSave={saveMedication} />
      </div>
    </div>
  );
}



