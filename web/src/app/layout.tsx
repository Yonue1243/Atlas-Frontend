import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppStateProvider } from "@/components/providers/app-state";
import { QueryProvider } from "@/components/providers/query-provider";

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
  title: "Atlas — Recursos naturales de Argentina",
  description:
    "Explorá los recursos naturales de Argentina por provincia mediante un mapa interactivo, educativo y moderno.",
};

export const viewport: Viewport = {
  themeColor: "#0a0c10",
  width: "device-width",
  initialScale: 1,
};

/** País activo. Preparado para expandirse a múltiples países en el futuro. */
const DEFAULT_COUNTRY_ID = "ar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-dvh overflow-hidden antialiased`}
      >
        <QueryProvider>
          <AppStateProvider countryId={DEFAULT_COUNTRY_ID}>
            {children}
          </AppStateProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
