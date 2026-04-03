"use client";

import { AppSidebar, useSidebarState } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

function MainContent({ children }: { children: React.ReactNode }) {
  const { expanded } = useSidebarState();
  return (
    <main
      className={`min-h-screen pb-16 transition-all duration-300 md:pb-0 ${
        expanded ? "md:pl-60" : "md:pl-16"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <AppSidebar />
      <MainContent>{children}</MainContent>
      <MobileNav />
    </div>
  );
}
