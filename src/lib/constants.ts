// Shared business constants — safe for both client and server

export const SHOP_NAME = "Fade & Blade";
export const SHOP_TAGLINE = "Barbering & Beauty. Booked in Seconds.";

/** Opening hours (24h). First slot start & last slot start are derived below. */
export const OPEN_HOUR = 10; // 10:00 AM
export const CLOSE_HOUR = 20; // 8:00 PM
export const SLOT_MINUTES = 30;

/** Capacity per time slot */
export const CHAIRS_PER_SLOT = 3; // standard chairs
export const EXPRESS_CHAIRS_PER_SLOT = 2; // chairs always reserved for express members

/** Extra charge for the Express / Priority Pass booking */
export const EXPRESS_FEE = 99; // ₹, flat per visit

/** How many days ahead the booking calendar shows (including today) */
export const BOOKING_DAYS_AHEAD = 14;

/** Last slot start time (a booking must finish before close; services are <= 60 min) */
export const LAST_SLOT_HOUR = CLOSE_HOUR - 1; // 19:00

export const OPENING_HOURS_LABEL = "Mon – Sun · 10:00 AM – 8:00 PM";

export const EXPRESS_BENEFITS = [
  {
    title: "Zero Wait, Guaranteed",
    desc: "Skip the queue entirely — your master barber starts within 5 minutes of arrival.",
  },
  {
    title: "Reserved Priority Chair",
    desc: "Two chairs on the floor are reserved exclusively for Express members, even at peak hours.",
  },
  {
    title: "Express Chair, Fast Finish",
    desc: "Streamlined service on a dedicated chair so you are in and out in record time.",
  },
  {
    title: "Complimentary Finish & Drink",
    desc: "A signature finish touch and a drink on the house while you get pampered.",
  },
] as const;

export function formatPrice(n: number): string {
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)}`;
}
