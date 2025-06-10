import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Siren, PhoneCall, Hospital, MapPin, ShieldAlert } from "lucide-react";
import { ContactInfo } from "@/components/features/emergency-system/contact-info";
import { NearbyHospitals } from "@/components/features/emergency-system/nearby-hospitals";
import { EmergencyCallButton } from "@/components/features/emergency-system/emergency-call-button";

export default function EmergencyPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Siren className="h-10 w-10 text-destructive" />
        <h1 className="text-4xl font-bold font-headline tracking-tight">Emergency System</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Quick access to emergency contacts, medical information, and local services.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EmergencyCallButton />
        <ContactInfo />
        <NearbyHospitals />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Emergency Protocol</CardTitle>
          </div>
          <CardDescription>Important steps to take during an emergency.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground font-code">
            <li>Stay calm and assess the situation.</li>
            <li>If safe, provide immediate first aid.</li>
            <li>Call emergency services using the button above or dialing your local emergency number.</li>
            <li>Provide clear information: location, nature of emergency, number of people involved.</li>
            <li>Contact designated family members or doctor.</li>
            <li>Have important medical information ready (see Medical Records).</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
