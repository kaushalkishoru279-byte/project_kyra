"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Hospital, MapPin } from "lucide-react";

export function NearbyHospitals() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Hospital className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Nearby Hospitals</CardTitle>
        </div>
        <CardDescription>Location of nearby medical facilities.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden mb-3">
          {/* Placeholder for Google Maps API integration */}
          <Image 
            src="https://placehold.co/600x400.png" 
            alt="Map placeholder" 
            width={600} 
            height={400}
            data-ai-hint="map city"
            className="object-cover w-full h-full" 
          />
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
