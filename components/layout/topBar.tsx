"use client";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { signOut } from "next-auth/react";
import { CiLogout } from "react-icons/ci";

export default function TopBar() {
  const { setTheme } = useTheme();
  return (
    <div className="flex flex-col w-full h-16 justify-center lg:px-10 bg-white dark:bg-inherit pr-2 border-b">
      <div className="flex justify-between lg:justify-end items-center">
        {/* Topbar */}

        <div className="lg:hidden flex px-2">
          <h4 className="font-bold text-xl">JWC</h4>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button
            className="gap-2 font-semibold"
            variant={"outline"}
            size={"sm"}
            onClick={async () => {
              await signOut();
            }}
          >
            <CiLogout className="h-4 w-4" /> <span>Logout</span>
          </Button>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>
    </div>
  );
}
