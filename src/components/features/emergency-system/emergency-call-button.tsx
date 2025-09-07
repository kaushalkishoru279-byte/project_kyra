
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneCall } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function EmergencyCallButton() {
  const { toast } = useToast();

  const handleCall = () => {
    // This will attempt to open the dialer on a mobile device.
    // In a browser, it may do nothing or ask for permission.
    window.location.href = "tel:911";

    toast({
      title: "Emergency Call Initiated",
      description: "Your device should be dialing 911. If not, please dial your local emergency number manually.",
      duration: 10000, // Keep toast longer for important messages
    });
  };

  return (
    <Card className="shadow-lg bg-destructive/10 border-destructive">
      <CardHeader className="items-center text-center">
         <PhoneCall className="h-10 w-10 text-destructive mb-2" />
        <CardTitle className="font-headline text-destructive">Emergency Call</CardTitle>
        <CardDescription className="text-destructive/80">Press to dial 911 immediately.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button 
          variant="destructive" 
          size="lg" 
          className="w-full h-16 text-xl gap-2 shadow-xl hover:bg-red-700"
          onClick={handleCall}
          aria-label="Make an emergency call to 911"
        >
          <PhoneCall className="h-6 w-6" />
          CALL 911
        </Button>
      </CardContent>
    </Card>
  );
}
