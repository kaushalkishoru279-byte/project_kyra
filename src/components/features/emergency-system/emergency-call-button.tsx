"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneCall } from "lucide-react";

export function EmergencyCallButton() {
  const handleCall = () => {
    // In a real app, this might initiate a call or show emergency numbers.
    // For web, direct dialing is limited. window.location.href = "tel:911" can work on mobiles.
    alert("Emergency Call Initiated (Simulated) - Call 911 or your local emergency number.");
  };

  return (
    <Card className="shadow-lg bg-destructive/10 border-destructive">
      <CardHeader className="items-center text-center">
         <PhoneCall className="h-10 w-10 text-destructive mb-2" />
        <CardTitle className="font-headline text-destructive">Emergency Call</CardTitle>
        <CardDescription className="text-destructive/80">Press in case of emergency.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button 
          variant="destructive" 
          size="lg" 
          className="w-full h-16 text-xl gap-2 shadow-xl hover:bg-red-700"
          onClick={handleCall}
          aria-label="Make an emergency call"
        >
          <PhoneCall className="h-6 w-6" />
          CALL NOW
        </Button>
      </CardContent>
    </Card>
  );
}
