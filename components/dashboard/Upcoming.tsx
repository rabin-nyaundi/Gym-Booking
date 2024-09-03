import React from "react";
import Booking from "./booking/booking";

export default function UpcomingSessions() {
  return (
    <div className="flex flex-auto h-auto border rounded-xl ">
      <div className="flex flex-col h-full gap-3 p-4 w-full">
        <h3 className="font-medium">Upcoming Sessions</h3>
        <Booking />
      </div>
    </div>
  );
}
