
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LocateFixed, AlertTriangle, Loader2 } from "lucide-react";
import { WeatherDisplay } from "@/components/features/weather-alerts/weather-display";
import { SmartAlerts } from "@/components/features/weather-alerts/smart-alerts";
import { Button } from "@/components/ui/button";
import { getWeatherDataForCity, type WeatherDataWithLocation } from "@/lib/weather";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';


export function WeatherClient({
  initialWeatherData
}: {
  initialWeatherData: WeatherDataWithLocation;
}) {

  const [weatherData, setWeatherData] = useState(initialWeatherData);
  const [newLocation, setNewLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleLocationChange = async () => {
    if (!newLocation.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a city name.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    const result = await getWeatherDataForCity(newLocation);
    if (result.error) {
      toast({
        title: "Location Not Found",
        description: `Could not find weather data for "${newLocation}". Please check the spelling or try another city.`,
        variant: "destructive",
      });
    } else {
      setWeatherData(result);
      toast({
        title: "Location Updated",
        description: `Now showing weather for ${result.locationName}.`,
      });
      setIsDialogOpen(false); // Close dialog on success
      setNewLocation("");
    }
    setIsLoading(false);
  };
  
  return (
    <div className="space-y-8">
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Change Location</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Location</DialogTitle>
                  <DialogDescription>
                    Enter a city name to get the latest weather forecast.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-2 items-center">
                  <Input 
                    placeholder="e.g., New York, London"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    onKeyDown={(e) => {if(e.key === 'Enter') handleLocationChange()}}
                  />
                   <Button type="submit" onClick={handleLocationChange} disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                  </Button>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
