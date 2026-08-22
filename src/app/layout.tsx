import type { Metadata, Viewport } from "next";
import { Inter, PT_Serif } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Parohia",
  description: "Daily readings, calendar, prayers, fasting rules, resources and parish directory.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#071a33",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${ptSerif.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background font-sans antialiased">
        <LanguageProvider>
          <div className="app-frame flex min-h-dvh flex-col">
            <AppShell>{children}</AppShell>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
