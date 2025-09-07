import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun, LocateFixed } from "lucide-react";
import { WeatherDisplay } from "@/components/features/weather-alerts/weather-display";
import { SmartAlerts } from "@/components/features/weather-alerts/smart-alerts";
import { Button } from "@/components/ui/button";
import { getWeatherData } from "@/lib/weather";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";


export default async function WeatherPage() {
  // Default to Springfield, IL
  const lat = 39.7817;
  const lon = -89.6501;

  const weatherData = await getWeatherData(lat, lon);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <CloudSun className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold font-headline tracking-tight">Weather Alerts</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Stay informed about local weather conditions and receive smart health-related alerts.
      </p>

      {weatherData.error && (
         <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Fetching Weather</AlertTitle>
            <AlertDescription>
                Could not fetch live weather data. Displaying static mock data instead. Error: {weatherData.error}
            </AlertDescription>
        </Alert>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LocateFixed className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Current Location: {weatherData.locationName}</CardTitle>
            </div>
            <Button variant="outline" size="sm">Change Location</Button>
          </div>
          <CardDescription>Weather forecast and conditions for the selected area.</CardDescription>
        </CardHeader>
        <CardContent>
            <WeatherDisplay weatherData={weatherData} />
        </CardContent>
      </Card>
      
      <SmartAlerts weatherData={weatherData} />
    </div>
  );
}
