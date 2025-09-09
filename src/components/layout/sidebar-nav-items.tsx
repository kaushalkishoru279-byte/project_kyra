
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  HeartPulse, Pill, Users, FileText, Siren, CloudSun, CalendarDays, Settings, LogOut, FileArchive, ShoppingCart, MessagesSquare, Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  external?: boolean;
};

export const mainNavItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: HeartPulse },
  { href: "/health", label: "Health Monitoring", icon: HeartPulse },
  { href: "/medication", label: "Medication Tracker", icon: Pill },
  { href: "/family", label: "Family Network", icon: Users },
  { href: "/records", label: "Medical Records", icon: FileText },
  { href: "/calendar", label: "Calendar View", icon: CalendarDays },
  { href: "/emergency", label: "Emergency System", icon: Siren },
  { href: "/weather", label: "Weather Alerts", icon: CloudSun },
  { href: "/news", label: "Today's News", icon: Globe },
  { href: "/social", label: "Social & Chat", icon: MessagesSquare },
  { href: "/vault", label: "Document Vault", icon: FileArchive },
  { href: "/shopping", label: "Shopping Lists", icon: ShoppingCart },
];

// Example for secondary navigation items if needed later
// export const secondaryNavItems: NavItem[] = [
//   { href: "/settings", label: "Settings", icon: Settings },
// ];

export function SidebarNavItems() {
  const pathname = usePathname();

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
      if (item.external) {
        return (
           <a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              "font-medium hover:font-semibold"
            )}
          >
            <item.icon className="h-5 w-5 text-sidebar-foreground/80" />
            {item.label}
          </a>
        )
      }

      const isActive = item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);
      
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-semibold",
            !isActive && "font-medium hover:font-semibold"
          )}
          aria-current={isActive ? "page" : undefined}
        >
          <item.icon className={cn("h-5 w-5", isActive ? "text-sidebar-primary" : "text-sidebar-foreground/80")} />
          {item.label}
        </Link>
      );
    });
  };

  return (
    <div className="flex flex-col gap-1">
      {renderNavItems(mainNavItems)}
      {/* Example for rendering secondary items
      {secondaryNavItems.length > 0 && (
        <>
          <Separator className="my-2 bg-sidebar-border" />
          {renderNavItems(secondaryNavItems)}
        </>
      )}
      */}
    </div>
  );
}
