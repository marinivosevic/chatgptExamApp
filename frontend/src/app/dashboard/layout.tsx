"use client";
import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarRight } from "@/components/sidebar-right";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/app/context/userContext";
import { useRouter } from "next/navigation";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import ClipLoader from "react-spinners/ClipLoader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const router = useRouter();
  const token = Cookies.get("token");

  if (!token) {
    router.push("/login");
  }
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader
          color={0x0000ff}
          loading={true}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <SidebarLeft />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background z-10">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Input placeholder="Search Exam or Course" />
            </div>
          </header>

          {/* Scrollable main content */}
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
        <SidebarRight />
      </div>
    </SidebarProvider>
  );
}
