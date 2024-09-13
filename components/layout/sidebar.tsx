import { authOptions } from "@/lib/auth";
import { SidebarItem } from "@/types/types";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  ChevronDoubleLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import {
  FolderIcon,
  HomeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

const navigation: SidebarItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: true },
  {
    name: "Booking",
    icon: FolderIcon,
    current: false,
    href: "/dashboard/booking",
    // children: [
    //   { name: "All", href: "#" },
    //   { name: "Today", href: "#" },
    // ],
  },
  {
    name: "Profile",
    icon: UserCircleIcon,
    current: false,
    href: "/dashboard/profile",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default async function Sidebar() {
  const session = await getServerSession(authOptions);
  return (
    <div className="hidden lg:flex h-screen bg-gray-100 dark:bg-inherit lg:w-72 flex-col gap-y-5 overflow-y-auto border-r border-gray-200 px-2 lg:px-6">
      <div className="flex justify-between h-24 shrink-0 items-center">
        {/* <Image
          alt={"Your Company"}
          src="/gym.jpg"
          className="h-8 w-auto"
          height={200}
          width={200}
        /> */}
        <p className="font-bold hidden lg:block font-sans lg:text-xl 2xl:text-2xl">
          JTL Wellness Club
        </p>

        <span className="lg:hidden font-bold font-mono block">
          JWC
        </span>

        {/* <div className="text-center">
          <ChevronDoubleLeftIcon className="h-8 w-8" />
        </div> */}
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  {!item.children ? (
                    <Link
                      href={item?.href ?? ""}
                      className={classNames(
                        item.current ? "bg-gray-50" : "hover:bg-gray-50",
                        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 w-auto"
                      )}
                    >
                      <item.icon
                        aria-hidden="true"
                        className="h-6 w-6 shrink-0 text-gray-400"
                      />
                      <span className="hidden lg:block">{item.name}</span>
                    </Link>
                  ) : (
                    <Disclosure as="div">
                      <DisclosureButton
                        className={classNames(
                          item.current ? "bg-gray-50" : "hover:bg-gray-50",
                          "group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold leading-6 text-gray-700"
                        )}
                      >
                        <item.icon
                          aria-hidden="true"
                          className="h-6 w-6 shrink-0 text-gray-400"
                        />
                        <span className="hidden lg:block">{item.name}</span>
                        <ChevronRightIcon
                          aria-hidden="true"
                          className="ml-auto h-5 w-5 shrink-0 text-gray-400 group-data-[open]:rotate-90 group-data-[open]:text-gray-500"
                        />
                      </DisclosureButton>
                      <DisclosurePanel as="ul" className="mt-1 px-2">
                        {item.children.map((subItem) => (
                          <li key={subItem.name}>
                            {/* 44px */}
                            <DisclosureButton
                              as="a"
                              href={subItem.href}
                              className={classNames(
                                subItem?.name
                                  ? "bg-gray-50"
                                  : "hover:bg-gray-50",
                                "block rounded-md py-2 pl-9 pr-2 text-sm leading-6 text-gray-700"
                              )}
                            >
                              {subItem.name}
                            </DisclosureButton>
                          </li>
                        ))}
                      </DisclosurePanel>
                    </Disclosure>
                  )}
                </li>
              ))}
            </ul>
          </li>
          <li className="-mx-6 mt-auto">
            <Link
              href="#"
              className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
            >
              {session?.user && (
                <Image
                  alt={session?.user?.name!}
                  src="/images/user.jpg"
                  className="h-8 w-8 rounded-full bg-gray-50"
                  width={50}
                  height={50}
                />
              )}
              <span className="sr-only">Your profile</span>
              <span aria-hidden="true">{session?.user?.name}</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
