
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, CloudLightning, Leaf, ThermometerSun, Sun } from "lucide-react";
import type { WeatherData } from "@/lib/weather";
import { useMemo } from "react";

interface SmartAlertsProps {
  weatherData: WeatherData;
}

export function SmartAlerts({ weatherData }: SmartAlertsProps) {

  const alerts = useMemo(() => {
    const generatedAlerts: { id: string; title: string; message: string; icon: React.ElementType, type: 'info' | 'warning' | 'danger' }[] = [];

    if(weatherData.error) return [];

    // Heat Advisory
    if (weatherData.daily.temperatureMax[0] > 90) {
      generatedAlerts.push({
        id: "heat",
        title: "Heat Advisory",
        message: `Temperatures will exceed 90°F today. Stay hydrated and avoid strenuous outdoor activity.`,
        icon: ThermometerSun,
        type: "danger",
      });
    }

    // High UV Index
    if (weatherData.daily.uvIndexMax[0] > 7) {
      generatedAlerts.push({
        id: "uv",
        title: "High UV Index Warning",
        message: `The UV index is very high (${Math.round(weatherData.daily.uvIndexMax[0])}) today. Use sunscreen and wear protective clothing.`,
        icon: Sun,
        type: "warning",
      });
    }
    
    // High Pollen (mocked, as API doesn't provide it)
    generatedAlerts.push({
        id: "pollen",
        title: "High Pollen Count Expected",
        message: "Pollen levels may be high today. Consider staying indoors if you have allergies. (Mock Data)",
        icon: Leaf,
        type: "info",
    });

    // Thunderstorm check
    if (weatherData.daily.weatherCode.slice(0, 3).some(code => code === 95)) {
         generatedAlerts.push({
            id: "thunderstorm",
            title: "Thunderstorm Watch",
            message: "Thunderstorms are possible in the next few days. Be prepared for potential power outages.",
            icon: CloudLightning,
            type: "info",
        });
    }


    return generatedAlerts;
  }, [weatherData]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Health & Weather Smart Alerts</CardTitle>
        </div>
        <CardDescription>Personalized alerts based on live weather conditions and health profile.</CardDescription>
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
                  <h4 className={`font-semibold ${alert.type === 'danger' ? 'text-destructive-foreground' : ''}`}>{alert.title}</h4>
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
