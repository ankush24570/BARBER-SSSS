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
  title: "Fade & Blade — Barbershop & Priority Booking",
  description:
    "Book your chair at Fade & Blade barbershop. Precision cuts, beard sculpting and hot towel shaves — or grab an Express Priority Pass and skip the queue entirely.",
  keywords: [
    "barbershop",
    "haircut booking",
    "beard trim",
    "hot towel shave",
    "express booking",
    "fade",
  ],
  icons: {
    icon: "/images/favicon.svg",
  },
  openGraph: {
    title: "Fade & Blade — Barbershop & Priority Booking",
    description:
      "Precision cuts, beard sculpting and hot towel shaves. Express Priority Pass available — skip the queue.",
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
