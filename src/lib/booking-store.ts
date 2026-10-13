"use client";

import { create } from "zustand";

export type Service = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  icon: string;
  popular: boolean;
  sortOrder: number;
};

type BookingIntentState = {
  services: Service[];
  servicesLoading: boolean;
  /** Service id chosen from outside the booking widget (e.g. a service card). */
  preselectedServiceId: string | null;
  /** Set when the user jumps to booking via an "Express" CTA. */
  preselectedExpress: boolean;
  setServices: (services: Service[]) => void;
  setServicesLoading: (loading: boolean) => void;
  preselectService: (id: string) => void;
  clearPreselection: () => void;
  requestExpress: () => void;
  clearExpressPreselection: () => void;
};

export const useBookingStore = create<BookingIntentState>((set) => ({
  services: [],
  servicesLoading: true,
  preselectedServiceId: null,
  preselectedExpress: false,
  setServices: (services) => set({ services }),
  setServicesLoading: (servicesLoading) => set({ servicesLoading }),
  preselectService: (id) => set({ preselectedServiceId: id }),
  clearPreselection: () => set({ preselectedServiceId: null }),
  requestExpress: () => set({ preselectedExpress: true }),
  clearExpressPreselection: () => set({ preselectedExpress: false }),
}));

/** Toggle Express on and glide to the booking widget. */
export function chooseExpressAndScroll() {
  useBookingStore.getState().requestExpress();
  requestAnimationFrame(() => {
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
  });
}

/** Select a service from anywhere and glide to the booking widget. */
export function chooseServiceAndScroll(id: string) {
  useBookingStore.getState().preselectService(id);
  requestAnimationFrame(() => {
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
  });
}
