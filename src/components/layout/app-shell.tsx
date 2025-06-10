import Link from "next/link";
import { BriefcaseMedical } from "lucide-react";
import { SidebarNavItems } from "./sidebar-nav-items";
import { AppHeader } from "./app-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
            <BriefcaseMedical className="h-6 w-6 text-sidebar-primary" />
            <span className="text-lg">CareConnect</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4 px-2">
          <SidebarNavItems />
        </nav>
        {/* Optional Sidebar Footer 
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/70">&copy; 2024 CareConnect</p>
        </div>
        */}
      </aside>

      <div className="flex flex-1 flex-col md:pl-64">
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
