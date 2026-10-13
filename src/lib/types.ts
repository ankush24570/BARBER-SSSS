/** One bookable time slot with remaining capacity (mirrors availability API). */
export type SlotInfo = {
  slot: string; // HH:mm
  label: string; // e.g. "10:00 AM"
  regularLeft: number;
  expressLeft: number;
  regularAvailable: boolean;
  expressAvailable: boolean;
};

export type ServiceDto = {
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

export type BookingResult = {
  id: string;
  code: string;
  customerName: string;
  phone: string;
  email: string | null;
  date: string;
  timeSlot: string;
  isExpress: boolean;
  expressFee: number;
  totalPrice: number;
  notes: string | null;
  service: ServiceDto;
};
