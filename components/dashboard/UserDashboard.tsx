import React from "react";
import MyBookings from "./MyBookings";
import UpcomingSessions from "./Upcoming";
import OverviewCard, { OverviewCardProps } from "./card";

import { MdEventAvailable } from "react-icons/md";

export const overviewCardData: OverviewCardProps[] = [
  {
    count: "100",
    label: "All Bookings",
    hint: "My total bookings",
    icon: <MdEventAvailable className="h-8 w-8" />,
  },

  {
    count: "20",
    label: "Completed Sessions",
    hint: "All sessions attaned",
    icon: <MdEventAvailable className="h-8 w-8" />,
  },
];

export default function UserDashboard() {
  return (
    <div className="w-full flex flex-col bg-white dark:bg-inherit lg:gap-8 gap-4 h-full">
      <div className="flex lg:flex-row flex-col w-full gap-8">
        {overviewCardData?.map((cardItem) => (
          <OverviewCard key={cardItem.label} item={cardItem} />
        ))}
      </div>
      <div className="flex lg:flex-row flex-col w-full gap-6 lg:gap-10 h-auto">
        <MyBookings />
        <UpcomingSessions />
      </div>
    </div>
  );
}
