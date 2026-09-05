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
  appleWebApp: {
    // Installed to the home screen, the status bar floats over the page
    // instead of occupying its own band.
    statusBarStyle: "black-translucent",
    title: "Parohia",
  },
};

export const viewport: Viewport = {
  /**
   * `cover` is what lets the page paint into the safe areas — under the status
   * bar at the top and the home indicator at the bottom — instead of the
   * browser reserving opaque bands there. Every screen already pads its own
   * content with env(safe-area-inset-*), so nothing lands under the clock.
   */
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  /* Matches the top of the page wash, so the status-bar strip blends into the
     page rather than sitting on it as a separate colour. */
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#d6e4f6" },
    { media: "(prefers-color-scheme: dark)", color: "#232833" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${ptSerif.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <LanguageProvider>
          <div className="app-frame flex min-h-dvh flex-col">
            <AppShell>{children}</AppShell>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
