"use client";

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Bell } from "lucide-react";

type Reminder = { id: string; due_at: string; status: 'pending'|'sent'|'ack'|'missed'; medication_id: string };
type MedicationLite = { id: string; name: string };

export function RemindersWidget() {
  const headers = { 'X-User-Id': 'demo-user', 'Content-Type': 'application/json' } as any;
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [meds, setMeds] = useState<MedicationLite[]>([]);

  const load = useCallback(async () => {
    const medsRes = await fetch('/api/medications', { headers, cache: 'no-store' });
    const medsList = medsRes.ok ? await medsRes.json() : [];
    setMeds(medsList.map((m: any) => ({ id: m.id, name: m.name })));
    const now = new Date();
    const to = new Date(now); to.setDate(to.getDate() + 3);
    const qs = `from=${encodeURIComponent(now.toISOString())}&to=${encodeURIComponent(to.toISOString())}`;
    const remRes = await fetch(`/api/medications/reminders?${qs}`, { headers, cache: 'no-store' });
    const remList = remRes.ok ? await remRes.json() : [];
    setReminders(remList);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const ack = async (id: string) => {
    await fetch('/api/medications/reminders', { method: 'PATCH', headers, body: JSON.stringify({ id, status: 'ack' }) });
    await load();
  };

  const labelFor = (mId: string) => meds.find(m => m.id === mId)?.name ?? 'Medication';

  const sorted = reminders.sort((a, b) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime());

  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary"/>
          <CardTitle className="font-headline">Upcoming Doses & Alerts</CardTitle>
        </div>
        <CardDescription>View upcoming medication schedule and any missed dose alerts.</CardDescription>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming reminders in the next 3 days.</p>
        ) : (
          <ul className="space-y-3">
            {sorted.map(r => (
              <li key={r.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">{labelFor(r.medication_id)}</div>
                    <div className="text-xs text-muted-foreground">Due {new Date(r.due_at).toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">{r.status}</Badge>
                  {r.status !== 'ack' && (
                    <Button size="sm" onClick={() => ack(r.id)}>
                      <Check className="h-4 w-4 mr-1" /> Ack
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}


