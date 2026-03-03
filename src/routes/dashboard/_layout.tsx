'use client'

import type React from "react"
import { useState } from "react"
import Header from "@/components/common/layout/Header"
import { BottomNav } from "@/components/common/layout/BottomNav"
import { SideBar } from "@/components/common/layout/SideBar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex flex-1">
                <SideBar collapsed={collapsed} />
                <main
                    className={`flex-1 p-4 md:p-6 overflow-auto pb-20 md:pb-6 transition-all duration-300 ${collapsed ? "ml-20" : "md:ml-[260px]"
                        }`}
                >
                    {children}
                </main>
            </div>

            <BottomNav />
        </div>
    )
}
