import { FC, SVGProps } from "react";

export interface SidebarItem {
  name: string;
  href?: string;
  current: boolean;
  icon: FC<SVGProps<SVGSVGElement>>;
  children?: SidebraSubItem[];
}

interface SidebraSubItem {
  name: string;
  href: string;
  current?: boolean;
}

export interface TrainingSlot {
  id: number | string;
  slot: string;
  capacity: number;
  createdAt: Date;
  updatedAt?: Date;
  bookings?: Booking[];
}

export interface Booking {
  id: string;
  userId: number;
  sessionId: number;
  trainingDate: Date;
  user: object;
  session: object;
  createdAt: Date;
  updatedAt: Date;
}

export enum BookingStatus {
  "booked" = "BOOKED",
  "canceled" = "CANCELED",
  "rejected" = "REJECTED",
}
