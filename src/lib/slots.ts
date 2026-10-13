import { LAST_SLOT_HOUR, OPEN_HOUR, SLOT_MINUTES } from "./constants";

/**
 * All possible slot start times for any day, e.g. "10:00", "10:30", ..., "19:00".
 * Formatted as 24h HH:mm — the client converts to a friendly label.
 */
export function generateAllSlots(): string[] {
  const slots: string[] = [];
  const startMinutes = OPEN_HOUR * 60;
  const endMinutes = LAST_SLOT_HOUR * 60;
  for (let m = startMinutes; m <= endMinutes; m += SLOT_MINUTES) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
  }
  return slots;
}

/** "10:00" -> "10:00 AM" */
export function slotLabel(slot: string): string {
  const [hStr, mStr] = slot.split(":");
  const h = Number(hStr);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mStr} ${suffix}`;
}

/** True if the given date (YYYY-MM-DD) + slot (HH:mm) is in the past (local time). */
export function isSlotInPast(date: string, slot: string): boolean {
  const now = new Date();
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = slot.split(":").map(Number);
  const slotDate = new Date(y, mo - 1, d, h, mi, 0, 0);
  return slotDate.getTime() <= now.getTime();
}

/** True if date string is a valid YYYY-MM-DD within [today, today + aheadDays]. */
export function isValidBookingDate(date: string, aheadDays: number): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [y, mo, d] = date.split("-").map(Number);
  const dateObj = new Date(y, mo - 1, d);
  if (
    dateObj.getFullYear() !== y ||
    dateObj.getMonth() !== mo - 1 ||
    dateObj.getDate() !== d
  )
    return false;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const max = new Date(startOfToday);
  max.setDate(max.getDate() + aheadDays - 1);
  return dateObj >= startOfToday && dateObj <= max;
}

/** YYYY-MM-DD for a local Date. */
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${day}`;
}
