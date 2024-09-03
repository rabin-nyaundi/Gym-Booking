"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import TrainingSessions from "@/components/dashboard/booking/training-session";
import axios from "axios";
import { Booking } from "@prisma/client";

export default function Page() {
  const [bookings, setBookings] = useState<Booking[]>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const getMyBookings = async () => {
    try {
      const response = await axios.get("/api/booking");

      const { data } = response.data;

      setBookings(data);
    } catch (error: any) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };

  useEffect(() => {
    getMyBookings();
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex w-full flex-col h-full">
        <div className="flex justify-end w-full">
          <Button onClick={() => setIsOpen(true)}>Book Session</Button>
        </div>
        <div className="flex flex-1 flex-col">
          <span>My Bookings</span>
          <div>
            {bookings &&
              bookings?.map((booking) => (
                <li key={booking.id} className="text-gray-700">
                  {booking.sessionId} -{" "}
                  {new Date(booking.createdAt).toLocaleDateString()} -{" "}
                  {booking.status}
                </li>
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col overflow-y-auto w-full h-auto lg:hidden">
        <Sheet open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
          <SheetContent className="overflow-y-auto h-auto" side={"bottom"}>
            <SheetHeader>
              <SheetTitle>Select slot and aply.</SheetTitle>
              <SheetDescription>
                <TrainingSessions />
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
