import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fade & Blade — Unisex Salon & Priority Booking",
  description:
    "Book your chair at Fade & Blade unisex salon. Precision cuts, beard sculpting, facials, hair spa and makeup — or grab an Express Priority Pass and skip the queue entirely.",
  keywords: [
    "salon booking",
    "barbershop",
    "beauty parlor",
    "haircut booking",
    "facial",
    "bridal makeup",
    "hair spa",
    "express booking",
    "unisex salon",
  ],
  icons: {
    icon: "/images/favicon.svg",
  },
  openGraph: {
    title: "Fade & Blade — Unisex Salon & Priority Booking",
    description:
      "Barbering and beauty under one roof. Express Priority Pass available — skip the queue.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
