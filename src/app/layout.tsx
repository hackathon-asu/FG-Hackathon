import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SidebarProvider, RoleProvider } from "@/components/layout/app-sidebar";
import { AuthProvider } from "@/components/auth/auth-provider";
import { FloatingFeedback } from "@/components/feedback/floating-feedback";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FirstGen Connect",
  description:
    "A supportive platform for first-generation college students — find mentors, build community, and navigate your college journey with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <RoleProvider>
              <SidebarProvider>
                {children}
                <FloatingFeedback />
              </SidebarProvider>
            </RoleProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
