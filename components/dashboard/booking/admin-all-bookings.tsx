"use client";

import axios from "axios";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Booking } from "@prisma/client";
import { BookingSession } from "@/app/dashboard/booking/page";

export default function AdminBookings() {
  const [allBookings, setAllBookings] = useState<BookingSession[]>();
  async function getMonthOldBookings() {
    try {
      const response = await axios.get("/api/admin/bookings");

      const { data } = response.data;
      setAllBookings(data);
    } catch (error: any) {
      toast.error("Failed to retrieve bookings", {
        description: "Could not retrieve all bookings ",
        action: {
          label: "Close",
          onClick: () => console.log("Error"),
        },
      });
    }
  }

  useEffect(() => {
    getMonthOldBookings();
  }, []);

  return (
    <div className="w-full h-full">
      <h3 className="text-xl font-medium"> Admin All Bookings</h3>
      <span className="text-sm text-gray-400 font-medium">
        Last 30 Days Bookins
      </span>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">User</TableHead>
            <TableHead>Training Date</TableHead>
            <TableHead>Reserved Slot</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allBookings &&
            allBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.user.name}</TableCell>
                <TableCell className="font-medium">
                  {new Date(booking.trainingDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{booking.session.slot}</TableCell>
                <TableCell>{`${booking.status}`}</TableCell>
                <TableCell className="font-medium">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
