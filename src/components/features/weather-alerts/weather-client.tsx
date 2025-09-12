
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LocateFixed, AlertTriangle, Loader2 } from "lucide-react";
import { WeatherDisplay } from "@/components/features/weather-alerts/weather-display";
import { SmartAlerts } from "@/components/features/weather-alerts/smart-alerts";
import { Button } from "@/components/ui/button";
import { getWeatherDataForCity, getWeatherData, type WeatherDataWithLocation } from "@/lib/weather";
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

  // Try to use browser location on first load
  useEffect(() => {
    let cancelled = false;
    if (typeof window === 'undefined' || !('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          if (cancelled) return;
          setIsLoading(true);
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const result = await getWeatherData(lat, lon);
          let resolvedName = result.locationName;
          try {
            const resp = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`);
            if (resp.ok) {
              const g = await resp.json();
              const first = g.results?.[0];
              if (first?.name) {
                resolvedName = `${first.name}, ${first.admin1 || ''}`.replace(/, $/, '');
              }
            }
          } catch (_) {
            // ignore
          }
          if (!cancelled && result) {
            setWeatherData({ ...result, locationName: resolvedName });
            toast({ title: "Location Detected", description: `Now showing weather for ${resolvedName}.` });
          }
        } catch (e) {
          // silently fall back
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      },
      async _err => {
        // User denied or error; try IP-based geolocation as a fallback
        try {
          setIsLoading(true);
          const ipRes = await fetch('https://ipapi.co/json/');
          if (ipRes.ok) {
            const ip = await ipRes.json();
            if (ip && typeof ip.latitude === 'number' && typeof ip.longitude === 'number') {
              const result = await getWeatherData(ip.latitude, ip.longitude);
              const locName = ip.city ? `${ip.city}, ${ip.region || ''}`.replace(/, $/, '') : result.locationName;
              setWeatherData({ ...result, locationName: locName });
              toast({ title: "Location Detected", description: `Now showing weather for ${locName}.` });
            }
          }
        } catch (_) {
          // ignore; fallback remains
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      },
      { enableHighAccuracy: true, maximumAge: 300000, timeout: 8000 }
    );
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {weatherData.error && !weatherData.current && ( // Only show major error if no data at all
         <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Fetching Initial Weather</AlertTitle>
            <AlertDescription>
                Could not fetch live weather data. Displaying last known or mock data. Error: {weatherData.error}
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
