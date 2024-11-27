
import { SidebarLeft } from "@/components/sidebar-left"
import { SidebarRight } from "@/components/sidebar-right"

import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <SidebarProvider>
      <SidebarLeft />
      <SidebarInset>
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Input  placeholder="Search Exam or Course" />
          </div>
        </header>
        
        <div className="">
        {children}
      </div>
      </SidebarInset>
      
      <SidebarRight />
    </SidebarProvider>
      )
  }