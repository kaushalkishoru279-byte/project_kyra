"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, CloudLightning, Leaf, ThermometerSun } from "lucide-react";

const alerts = [
  { id: "1", title: "High Pollen Count Expected", message: "Pollen levels will be high tomorrow. Consider staying indoors if you have allergies.", icon: Leaf, type: "warning" },
  { id: "2", title: "Heat Advisory", message: "Temperatures will exceed 90°F. Stay hydrated and avoid strenuous outdoor activity.", icon: ThermometerSun, type: "danger" },
  { id: "3", title: "Thunderstorm Watch", message: "Possible thunderstorms this afternoon. Be prepared for potential power outages.", icon: CloudLightning, type: "info" },
];

export function SmartAlerts() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Health & Weather Smart Alerts</CardTitle>
        </div>
        <CardDescription>Personalized alerts based on weather conditions and health profile.</CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length > 0 ? (
          <ul className="space-y-3">
            {alerts.map((alert) => (
              <li key={alert.id} className={`flex items-start gap-3 p-4 rounded-lg border ${
                alert.type === 'danger' ? 'bg-destructive/10 border-destructive/50 text-destructive-foreground' :
                alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-700' :
                'bg-accent/50 border-accent text-accent-foreground'
              }`}>
                <alert.icon className={`h-5 w-5 mt-0.5 shrink-0 ${
                  alert.type === 'danger' ? 'text-destructive' :
                  alert.type === 'warning' ? 'text-yellow-600' :
                  'text-primary'
                }`} />
                <div>
                  <h4 className={`font-semibold ${alert.type === 'danger' ? 'text-destructive' : ''}`}>{alert.title}</h4>
                  <p className="text-sm">{alert.message}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-center py-4">No smart alerts currently.</p>
        )}
      </CardContent>
    </Card>
  );
}
