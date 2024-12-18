'use client'

import * as React from "react";
import {
  Home,
  Inbox,
  Power,
  Search,
  Settings2,
  Sparkles,
} from "lucide-react";
import { NavUser } from "@/components/nav-user";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { logo } from "@/constants/images";
import Image from "next/image";
import { useUser } from "@/app/context/userContext";

// This is sample data.


export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useUser();
  const data = {
 
    navMain: [
      {
        title: "Search",
        url: "#",
        icon: Search,
      },
      {
        title: "Ask AI",
        url: "#",
        icon: Sparkles,
      },
      {
        title: "Home",
        url: "#",
        icon: Home,
        isActive: true,
      },
      {
        title: "Inbox",
        url: "#",
        icon: Inbox,
        badge: "10",
      },
    ],
    navMainFooter: [
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
      },
     
    ],
  };
  return (
    <div  className="bg-navcolor-400 ">
      <Sidebar className="border-r-0 p-1 ml-1 text-white " {...props}>
        <SidebarHeader  className="bg-navcolor-400 flex flex-row align-middle" >
          <Image src={logo} alt="Logo" width={32} height={32} />
          <span>AppName</span>
        </SidebarHeader>
        <SidebarContent  className="bg-navcolor-400 ">
          <NavMain items={data.navMain} />
          <NavMain items={data.navMainFooter} />
        </SidebarContent>
        <SidebarFooter  className="bg-navcolor-400">
          <NavUser user={user} />
        </SidebarFooter>
       
      </Sidebar>
    </div>
  );
}
