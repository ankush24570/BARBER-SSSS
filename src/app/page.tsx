"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/barber/navbar";
import { Hero } from "@/components/barber/hero";
import { Marquee } from "@/components/barber/marquee";
import { Services } from "@/components/barber/services";
import { Express } from "@/components/barber/express";
import { Booking } from "@/components/barber/booking";
import { Gallery } from "@/components/barber/gallery";
import { Footer } from "@/components/barber/footer";
import { useBookingStore } from "@/lib/booking-store";
import type { ServiceDto } from "@/lib/types";

export default function Home() {
  const setServices = useBookingStore((s) => s.setServices);
  const setServicesLoading = useBookingStore((s) => s.setServicesLoading);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load services");
        if (!cancelled) setServices(data.services as ServiceDto[]);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setServicesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setServices, setServicesLoading]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <Services />
        <Express />
        <Booking />
        <Gallery />
      </main>
      <Footer />
    </>
  );
}
