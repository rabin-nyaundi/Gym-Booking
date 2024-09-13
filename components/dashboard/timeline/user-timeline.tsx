"use client";

import { BookingSession } from "@/app/dashboard/booking/page";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { BookingStatus } from "@prisma/client";
import { TrashIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en-KE";

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo("en-KE");

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function UserTimeline() {
  const [activities, setActivities] = useState<BookingSession[]>();

  async function getBookingActivity() {
    try {
      const response = await axios.get("/api/activity");

      const { data } = response.data;

      setActivities(data);

      console.log("====================================");
      console.log(data, "ACTIVITY");
      console.log("====================================");
      return data;
    } catch (error: any) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  }

  useEffect(() => {
    getBookingActivity();
  }, []);

  return (
    <div className="flow-root p-2">
      <ul role="list" className="-mb-8">
        {activities &&
          activities.map((activity, idx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {idx !== activities.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={classNames(
                        // event.iconBackground,
                        "flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white"
                      )}
                    >
                      {activity.status === BookingStatus.Booked ? (
                        <div className=" text-white p-2 rounded-md">
                          <CheckCircleIcon className="h-6 w-6 bg-green-500 rounded-xl" />
                        </div>
                      ) : activity.status === BookingStatus.Cancelled ? (
                        <div className=" text-white p-2 rounded-md">
                          <XCircleIcon className="h-6 w-6 bg-yellow-500 rounded-xl" />
                        </div>
                      ) : activity.status == BookingStatus.Rejected ? (
                        <div className=" text-white p-2 rounded-md">
                          <ExclamationCircleIcon className="h-6 w-6 bg-gray-500 rounded-xl" />
                        </div>
                      ) : (
                        <div className=" text-white p-2 rounded-md">
                          <TrashIcon className="h-6 w-6 bg-red-500 rounded-xl" />
                        </div>
                      )}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        {activity.status === BookingStatus.Booked
                          ? `You ${activity.status} a session - (${
                              activity.session.slot
                            }) - on ${new Date(
                              activity.trainingDate
                            ).toLocaleDateString()}`
                          : activity.status === BookingStatus.Cancelled
                          ? `You ${activity.status}  a session - (${
                              activity.session.slot
                            }) - on ${new Date(
                              activity.trainingDate
                            ).toLocaleDateString()}`
                          : activity.status === BookingStatus.Rejected
                          ? `Admin ${
                              activity.status
                            } your booking  a session - (${
                              activity.session.slot
                            }) - on ${new Date(
                              activity.trainingDate
                            ).toLocaleDateString()}.`
                          : `You ${activity.status} a session (${
                              activity.session.slot
                            }) - ${new Date(
                              activity.trainingDate
                            ).toLocaleDateString()} `}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500 lg:block hidden">
                      <time
                        dateTime={new Date(
                          activity.updatedAt
                        ).toLocaleDateString()}
                      >
                        {new Date(activity.updatedAt).toLocaleDateString()} -{" "}
                        <span className="lg:block hidden">
                          {timeAgo.format(
                            new Date(activity.updatedAt),
                            "twitter-now"
                          )}
                        </span>
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
