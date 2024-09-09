"use client";

import { TrainingSessionWithBookings } from "@/app/dashboard/booking/page";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { BookingStatus } from "@/types/types";
import { TrainingSession } from "@prisma/client";
import React, { useEffect, useState } from "react";

export default function Sessions({
  sessions,
  handleCloseSheet,
}: {
  sessions: TrainingSessionWithBookings[];
  handleCloseSheet: () => void;
}) {
  const [availableSessions, setAvailableSessions] =
    useState<TrainingSessionWithBookings>();

  async function handleBooking(session: TrainingSession) {
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: session.id,
        status: BookingStatus.booked,
      }),
    });

    const data = await response.json();
    if (response?.status === 400) {
      console.log("Booking failed=>:", data.error);
      toast({
        variant: "destructive",
        title: "Failed.",
        description: `${data.error}`,
      });
      handleCloseSheet();
      return;
    }
    if (response.ok) {
      console.log("Booking successful:", data);
      toast({
        title: "Sucess",
        description: "Session booked Sucessfully.",
      });
    } else {
      console.error("Booking failed:", data);
      toast({
        variant: "destructive",
        title: "Failed.",
        description: "Failed to book the session.",
      });
    }
    handleCloseSheet();
  }

  return (
    <div className="max-w-3xl flex flex-col h-auto mx-auto p-2">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        {sessions &&
          sessions.map((session, index) => (
            <div
              key={index}
              className={`border p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 ${
                session.capacity >= 5
                  ? "bg-slate"
                  : "bg-red-100 cursor-not-allowed"
              }`}
            >
              <h3 className="text-sm font-semibold text-gray-700">
                {session.slot}
              </h3>
              <Button
                onClick={async () => {
                  await handleBooking(session);
                }}
                className={`mt-4 rounded-md text-white ${
                  session ? "bg-primary" : "bg-gray-500 cursor-not-allowed"
                }`}
                disabled={!session}
              >
                {session ? "Book Now" : "Not Available"}
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
}
