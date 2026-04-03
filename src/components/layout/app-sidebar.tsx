"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Home,
  Users,
  Calendar,
  Award,
  BookOpen,
  Compass,
  LayoutDashboard,
  Menu,
  UserCog,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/social", label: "Social", icon: Users },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/alumni", label: "Alumni", icon: Award },
  { href: "/advising", label: "AI Advisor", icon: BookOpen },
  { href: "/decisions", label: "Life Guide", icon: Compass },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/alumni/dashboard", label: "Alumni Portal", icon: UserCog },
  { href: "/admin", label: "Admin", icon: Shield },
];

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <nav className="flex flex-col gap-1 px-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="size-5 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-3 left-3 z-50 md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-2 border-b border-border px-4 py-4">
                <GraduationCap className="size-6 text-primary" />
                <span className="text-base font-semibold">
                  FirstGen Connect
                </span>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                <SidebarContent pathname={pathname} />
              </div>
              <div className="border-t border-border px-4 py-3 text-center text-xs text-muted-foreground">
                You belong here.
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <aside className="group/sidebar fixed inset-y-0 left-0 z-40 hidden w-16 flex-col border-r border-border bg-sidebar transition-all duration-300 hover:w-60 md:flex">
        <div className="flex items-center gap-2 border-b border-border px-4 py-4">
          <GraduationCap className="size-6 shrink-0 text-primary" />
          <span className="truncate text-base font-semibold opacity-0 transition-opacity duration-300 group-hover/sidebar:opacity-100">
            FirstGen Connect
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="flex flex-col gap-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="size-5 shrink-0" />
                  <span className="truncate opacity-0 transition-opacity duration-300 group-hover/sidebar:opacity-100">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-border px-4 py-3 text-center text-xs text-muted-foreground opacity-0 transition-opacity duration-300 group-hover/sidebar:opacity-100">
          You belong here.
        </div>
      </aside>
    </>
  );
}
