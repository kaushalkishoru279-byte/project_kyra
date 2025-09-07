
"use client";

import { MessagesSquare } from "lucide-react";

export default function SocialPage() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <MessagesSquare className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold font-headline tracking-tight">Social & Chat</h1>
      </div>
       <p className="text-lg text-muted-foreground mb-8 shrink-0">
        Connect with your family and care team. Share updates, photos, and send messages in real-time.
      </p>
      <div className="flex-grow w-full h-full border rounded-lg overflow-hidden shadow-inner">
         <iframe
            src="https://backbook.vercel.app/"
            title="Social and Chat"
            className="w-full h-full border-0"
            allow="microphone; camera" // Optional: if the embedded app needs these permissions
          />
      </div>
    </div>
  );
}
