"use client";

import { CiCalendar, CiHome, CiUser } from "react-icons/ci";

import { BsCalendar4Event } from "react-icons/bs";
import Link from "next/link";

export default function BottomNavigationBar() {
  return (
    <div className="w-full h-16 bg-[#edf2fa] dark:bg-inherit py-2 lg:hidden block">
      <div className="flex w-full h-full">
        <ul className="w-full flex  justify-between items-center px-16">
          <li className="flex items-center justify-center flex-col">
            <Link
              className="flex items-center justify-center flex-col"
              href={"/dashboard"}
            >
              <CiHome className="h-6 w-6 text-gray-700 dark:text-inherit font-bold" />
              <span className="text-sm font-semibold text-gray-800 dark:text-inherit">
                Home
              </span>
            </Link>
          </li>
          <li className="flex items-center justify-center flex-col">
            <Link
              className="flex items-center justify-center flex-col"
              href={"/dashboard/booking"}
            >
              <CiCalendar className="h-6 w-6 text-gray-700 dark:text-inherit font-bold" />
              <span className="text-sm font-semibold text-gray-800 dark:text-inherit">
                Booking
              </span>
            </Link>
          </li>
          <li className="flex items-center justify-center flex-col">
            <Link
              className="flex items-center justify-center flex-col"
              href={"/dashboard/profile"}
            >
              <CiUser className="h-6 w-6 text-gray-700 dark:text-inherit font-bold" />
              <span className="text-sm font-semibold text-gray-800 dark:text-inherit">
                Profile
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
