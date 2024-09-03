import React from "react";
import UserTimeline from "./timeline/user-timeline";

export default function MyBookings() {
  return (
    <div className="lg:w-1/2 flex flex-col h-auto border rounded-xl">
      <div className="flex gap-4 flex-col h-full w-full lg:p-4">
        <h3 className="font-medium">My Activity</h3>
        <div className="flex flex-col h-auto w-full">
          <UserTimeline />
        </div>
      </div>
    </div>
  );
}
