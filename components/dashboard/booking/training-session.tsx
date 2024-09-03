"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { TrainingSession } from "@prisma/client";
import axios from "axios";
import React, { useEffect, useState } from "react";

const sessions = [
  { time: "05:00 AM - 07:00 AM", available: true },
  { time: "07:00 AM - 09:00 AM", available: true },
  { time: "09:00 AM - 11:00 AM", available: true },
  { time: "11:00 AM - 01:00 PM", available: true },
  { time: "01:00 PM - 03:00 PM", available: false }, // Break time
  { time: "03:00 PM - 05:00 PM", available: true },
  { time: "05:00 PM - 07:00 PM", available: true },
];

const TrainingSessions: React.FC = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>();

  async function getTrainingSessions() {
    try {
      const response = await axios.get("/api/training-session");

      const { data } = response.data;

      setSessions(data);

      console.log("====================================");
      console.log(data);
      console.log("====================================");
    } catch (error: any) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  }

  async function handleBooking() {
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: 1, // Replace with the actual session ID
        status: "booked", // Optional, defaults to 'booked'
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
  }

  useEffect(() => {
    getTrainingSessions();
  }, []);

  return (
    <div className="max-w-3xl flex flex-col h-auto mx-auto p-2">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        {sessions &&
          sessions.map((session, index) => (
            <div
              key={index}
              className={`border p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 ${
                session.capacity < 5
                  ? "bg-slate"
                  : "bg-red-100 cursor-not-allowed"
              }`}
            >
              <h3 className="text-sm font-semibold text-gray-700">
                {session.timeSlot}
              </h3>
              <Button
                onClick={async () => {
                  await handleBooking();
                }}
                className={`mt-4 rounded-md text-white ${
                  session.capacity < 5
                    ? "bg-primary"
                    : "bg-gray-500 cursor-not-allowed"
                }`}
                disabled={session.maxCapacity === session.capacity}
              >
                {session.capacity < 5 ? "Book Now" : "Not Available"}
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TrainingSessions;
