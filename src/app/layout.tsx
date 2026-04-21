import type { Metadata, Viewport } from "next";
import { Quicksand, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KNOT — Collaborations that feel like connections",
  description:
    "A platform for real, trackable collaborations between local businesses and content creators.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KNOT",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#EDE8E2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${quicksand.variable} ${lora.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.svg" />
      </head>
      <body className="min-h-dvh flex flex-col antialiased">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
