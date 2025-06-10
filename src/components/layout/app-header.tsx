"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BriefcaseMedical, Menu } from "lucide-react";
import { SidebarNavItems } from "./sidebar-nav-items";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:justify-end md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 md:hidden w-72 bg-sidebar">
          <div className="flex h-16 items-center border-b border-sidebar-border px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
              <BriefcaseMedical className="h-6 w-6 text-sidebar-primary" />
              <span>CareConnect</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            <SidebarNavItems />
          </nav>
        </SheetContent>
      </Sheet>
      {/* Placeholder for user dropdown or other header actions */}
      {/* <UserNav /> */}
    </header>
  );
}
