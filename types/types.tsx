import { FC, SVGProps } from "react";

export interface SidebarItem {
  name: string;
  href?: string;
  current: boolean;
  icon: FC<SVGProps<SVGSVGElement>>;
  children?: SidebraSubItem[];
}

interface SidebraSubItem {
  name: string;
  href: string;
  current?: boolean;
}
