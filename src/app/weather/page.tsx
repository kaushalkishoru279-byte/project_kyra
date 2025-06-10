import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun, Thermometer, Droplets, Wind, AlertTriangle, LocateFixed } from "lucide-react";
import { WeatherDisplay } from "@/components/features/weather-alerts/weather-display";
import { SmartAlerts } from "@/components/features/weather-alerts/smart-alerts";
import { Button } from "@/components/ui/button";

export default function WeatherPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <CloudSun className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold font-headline tracking-tight">Weather Alerts</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Stay informed about local weather conditions and receive smart health-related alerts.
      </p>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LocateFixed className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Current Location: Springfield, IL</CardTitle>
            </div>
            <Button variant="outline" size="sm">Change Location</Button>
          </div>
          <CardDescription>Weather forecast and conditions for the selected area.</CardDescription>
        </CardHeader>
        <CardContent>
            <WeatherDisplay />
        </CardContent>
      </Card>
      
      <SmartAlerts />
    </div>
  );
}
