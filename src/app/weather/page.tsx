
import { CloudSun } from "lucide-react";
import { getWeatherData } from "@/lib/weather";
import { WeatherClient } from "@/components/features/weather-alerts/weather-client";

export default async function WeatherPage() {
  const lat = 39.7817; // Springfield, IL
  const lon = -89.6501;
  const initialWeatherData = await getWeatherData(lat, lon);

  return (
    <div className="container mx-auto py-8 space-y-8">
       <div className="flex items-center gap-4">
        <CloudSun className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold font-headline tracking-tight">Weather Alerts</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Stay informed about local weather conditions and receive smart health-related alerts.
      </p>
      
      <WeatherClient initialWeatherData={initialWeatherData} />
    </div>
  );
}
