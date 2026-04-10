"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  PanelLeftClose,
  PanelLeft,
  Sun,
  Moon,
  MessageSquare,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState, createContext, useContext, useEffect } from "react";
import { useTheme } from "next-themes";
import { ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";

export type UserRole = "student" | "alumni" | "admin";

const RoleContext = createContext<{
  role: UserRole;
  setRole: (r: UserRole) => void;
}>({ role: "student", setRole: () => {} });

export function useRole() {
  return useContext(RoleContext);
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>("student");

  useEffect(() => {
    function syncRole() {
      try {
        const raw = localStorage.getItem('fg-auth')
        if (raw) {
          const user = JSON.parse(raw)
          if (user.role) setRole(user.role)
        }
      } catch { /* ignore */ }
    }
    syncRole()
    // Same-tab auth changes + cross-tab storage events
    window.addEventListener('fg-auth-change', syncRole)
    window.addEventListener('storage', syncRole)
    return () => {
      window.removeEventListener('fg-auth-change', syncRole)
      window.removeEventListener('storage', syncRole)
    }
  }, [])

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

const navItems: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: UserRole[];
}[] = [
  // Student
  { href: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["student"] },
  { href: "/social", label: "Social", icon: Users, roles: ["student"] },
  { href: "/alumni", label: "Alumni", icon: Award, roles: ["student"] },
  { href: "/advising", label: "AI Advisor", icon: BookOpen, roles: ["student"] },
  // Alumni
  { href: "/alumni/dashboard", label: "Alumni Dashboard", icon: LayoutDashboard, roles: ["alumni"] },
  { href: "/alumni/messages", label: "Messages", icon: MessageSquare, roles: ["alumni"] },
  { href: "/alumni/impact", label: "Your Impact", icon: Award, roles: ["alumni"] },
  // Admin
  { href: "/admin", label: "Admin Dashboard", icon: LayoutDashboard, roles: ["admin"] },
  { href: "/admin/tickets", label: "AI Tickets", icon: Bot, roles: ["admin"] },
  { href: "/admin/feedback", label: "Feedback & Requests", icon: MessageSquare, roles: ["admin"] },
];

// Context so AppLayout can read the expanded state
const SidebarContext = createContext<{
  expanded: boolean;
  setExpanded: (v: boolean) => void;
}>({ expanded: false, setExpanded: () => {} });

export function useSidebarState() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
}

function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex items-center gap-3 rounded-lg text-sm font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
        compact ? "px-3 py-2.5" : "w-full px-3 py-2.5"
      )}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="size-5 shrink-0" /> : <Moon className="size-5 shrink-0" />}
      {!compact && (
        <span className="truncate">{isDark ? "Light Mode" : "Dark Mode"}</span>
      )}
    </button>
  );
}

function UserFooter({ compact, expanded }: { compact?: boolean; expanded?: boolean }) {
  const { user, logout } = useAuth();
  if (!user) return null;

  // Mobile sidebar variant (no expanded prop)
  if (expanded === undefined) {
    return (
      <div className="border-t border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-medium text-foreground">{user.name}</p>
            <p className="truncate text-[10px] text-muted-foreground">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Sign out"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  // Desktop sidebar variant
  return (
    <div className="border-t border-sidebar-border px-2 py-2">
      {expanded ? (
        <div className="flex items-center gap-2 px-1">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-medium text-sidebar-foreground">{user.name}</p>
            <p className="truncate text-[10px] text-sidebar-foreground/50">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex size-7 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            title="Sign out"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={logout}
          className="mx-auto flex size-10 items-center justify-center rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          title="Sign out"
        >
          <LogOut className="size-5" />
        </button>
      )}
    </div>
  );
}

const roleLabels: Record<UserRole, string> = {
  student: "Student",
  alumni: "Alumni",
  admin: "Admin",
};

const roleDashboards: Record<UserRole, string> = {
  student: "/",
  alumni: "/alumni/dashboard",
  admin: "/admin",
};

function RoleSelector({ compact = false }: { compact?: boolean }) {
  const { role, setRole } = useRole();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const roles: UserRole[] = ["student", "alumni", "admin"];

  function switchRole(r: UserRole) {
    setRole(r);
    setOpen(false);
    router.push(roleDashboards[r]);
  }

  if (compact) {
    return (
      <div className="relative px-2">
        <button
          onClick={() => setOpen(!open)}
          className="mx-auto flex size-10 items-center justify-center rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          title={`Role: ${roleLabels[role]}`}
        >
          <span className="text-xs font-bold uppercase">{role[0]}</span>
        </button>
        {open && (
          <div className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded-lg border border-border bg-popover p-1 shadow-lg">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={cn(
                  "block w-full rounded-md px-3 py-1.5 text-left text-xs font-medium transition-colors",
                  r === role ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {roleLabels[r]}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative px-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      >
        <span className="flex-1 text-left">Role: {roleLabels[role]}</span>
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="mt-1 rounded-lg border border-border bg-popover p-1 shadow-lg">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => switchRole(r)}
              className={cn(
                "block w-full rounded-md px-3 py-1.5 text-left text-xs font-medium transition-colors",
                r === role ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {roleLabels[r]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarContent({ pathname }: { pathname: string }) {
  const { role } = useRole();
  const filtered = navItems.filter((item) => item.roles.includes(role));
  return (
    <nav className="flex flex-col gap-1 px-2">
      {filtered.map((item) => {
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

function DesktopNav({ pathname, expanded }: { pathname: string; expanded: boolean }) {
  const { role } = useRole();
  const filtered = navItems.filter((item) => item.roles.includes(role));
  return (
    <nav className="flex flex-col gap-1 px-2">
      {filtered.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            title={!expanded ? item.label : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <item.icon className="size-5 shrink-0" />
            <span
              className={cn(
                "truncate transition-all duration-300",
                expanded ? "w-auto opacity-100" : "w-0 opacity-0"
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { expanded, setExpanded } = useSidebarState();

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
              <div className="border-t border-border py-2">
                <RoleSelector />
              </div>
              <div className="border-t border-border px-2 py-2">
                <ThemeToggle />
              </div>
              <UserFooter />
              <div className="border-t border-border px-4 py-3 text-center text-xs text-muted-foreground">
                You belong here.
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 md:flex",
          expanded ? "w-60" : "w-16"
        )}
      >
        <div className="flex items-center border-b border-sidebar-border px-3 py-4">
          {expanded ? (
            <>
              <GraduationCap className="size-6 shrink-0 text-sidebar-primary" />
              <span className="ml-2 flex-1 truncate text-base font-semibold text-sidebar-foreground">
                FirstGen Connect
              </span>
              <button
                onClick={() => setExpanded(false)}
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                <PanelLeftClose className="size-4" />
                <span className="sr-only">Collapse sidebar</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setExpanded(true)}
              className="mx-auto flex size-10 items-center justify-center rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <PanelLeft className="size-5" />
              <span className="sr-only">Expand sidebar</span>
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <DesktopNav pathname={pathname} expanded={expanded} />
        </div>

        <div className="border-t border-sidebar-border py-2">
          {expanded ? <RoleSelector /> : <RoleSelector compact />}
        </div>
        <div className="border-t border-sidebar-border px-2 py-2">
          {expanded ? (
            <ThemeToggle />
          ) : (
            <ThemeToggle compact />
          )}
        </div>
        <UserFooter expanded={expanded} />
        <div
          className={cn(
            "border-t border-sidebar-border px-4 py-3 text-center text-xs text-sidebar-foreground/50 transition-all duration-300",
            expanded ? "opacity-100" : "opacity-0"
          )}
        >
          You belong here.
        </div>
      </aside>
    </>
  );
}
