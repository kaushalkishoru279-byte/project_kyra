
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Hospital, MapPin, Loader2, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface LocationState {
  lat: number | null;
  lon: number | null;
  loading: boolean;
  error: string | null;
}

export function NearbyHospitals() {
  const [location, setLocation] = useState<LocationState>({
    lat: null,
    lon: null,
    loading: true,
    error: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ lat: null, lon: null, loading: false, error: "Geolocation is not supported by your browser." });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          loading: false,
          error: null,
        });
      },
      (error) => {
        setLocation({
          lat: null,
          lon: null,
          loading: false,
          error: `Error getting location: ${error.message}`,
        });
         toast({
            variant: 'destructive',
            title: 'Location Access Denied',
            description: 'Could not fetch your location. Please enable location services for this site to see a live map.',
        });
      }
    );
  }, [toast]);

  const mapSrc = location.lat && location.lon 
    ? `https://maps.google.com/maps?q=${location.lat},${location.lon}&hl=es;z=14&output=embed`
    : "https://placehold.co/600x400.png";

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Hospital className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Nearby Hospitals</CardTitle>
        </div>
        <CardDescription>Live map based on your current location.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden mb-3">
          {location.loading && (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Fetching your location...</p>
            </div>
          )}
          {location.error && !location.loading && (
             <div className="flex flex-col items-center gap-2 text-destructive p-4 text-center">
              <AlertTriangle className="h-8 w-8" />
              <p className="text-sm font-semibold">Could not get your location</p>
              <p className="text-xs">{location.error}</p>
            </div>
          )}
          {!location.loading && !location.error && location.lat && (
             <iframe
                src={mapSrc}
                title="Map of your current location"
                className="w-full h-full border-0"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
          )}
           {!location.loading && !location.error && !location.lat && (
             <Image 
                src="https://placehold.co/600x400.png" 
                alt="Map placeholder" 
                width={600} 
                height={400}
                data-ai-hint="map city"
                className="object-cover w-full h-full" 
            />
           )}
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" /> 
            <span>City General Hospital - 123 Main St (2.5 miles)</span>
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" /> 
            <span>Hope Medical Center - 456 Oak Ave (3.1 miles)</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
