import React from "react";
import UserTimeline from "./timeline/user-timeline";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";
import AllBookings from "./booking/all-bookings";
import GroupedBookingBySlot from "./booking/booking";

export default async function MyBookings() {
  const session = await getServerSession(authOptions);
  return (
    <div className="w-full flex flex-col h-auto ">
      {/* <div className="flex flex-col w-full h-auto">
        <GroupedBookingBySlot />
      </div> */}
      <div className="flex gap-4 p-2 flex-col h-full w-full lg:p-4 border rounded-xl">
        <h3 className="font-medium">
          {session?.user.role === Role.ADMIN ? "All Bookings" : "My Activity"}
        </h3>
        <div className="flex flex-col h-auto w-full">
          {session?.user.role === Role.USER ? (
            <UserTimeline />
          ) : session?.user.role === Role.ADMIN ? (
            <div className="flex flex-col">
              <AllBookings />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
