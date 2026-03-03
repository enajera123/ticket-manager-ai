"use client"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useNavItems } from "@/hooks/useNavItems"
import { useLocation } from "react-router-dom"

const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3,
            staggerChildren: 0.05,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
}

interface SideBarProps {
    collapsed?: boolean
}

export function SideBar({ collapsed = false }: SideBarProps) {
    const location = useLocation()
    const pathname = location.pathname
    const { navItems } = useNavItems()
    return (
        <motion.nav
            className={cn(
                "hidden border-r bg-card md:block fixed top-16 left-0 h-[calc(100vh-4rem)] transition-all duration-300",
                collapsed ? "w-20" : "w-64"
            )}
            initial="hidden"
            animate="visible"
            variants={sidebarVariants}
        >
            <div className="space-y-4 py-4">
                <div className="px-2 py-2">
                    {!collapsed && (
                        <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                            Dashboard
                        </h2>
                    )}
                    <div className={cn("space-y-1", collapsed && "flex flex-col items-center")}>
                        {navItems.map((item) => (
                            <motion.div key={item.href} variants={itemVariants} className="w-full">
                                <Button
                                    variant={"ghost"}
                                    size="sm"
                                    className={cn(
                                        "w-full justify-start transition-all",
                                        collapsed
                                            ? "justify-center px-0"
                                            : "bg-transparent",
                                        pathname === item.href &&
                                        "bg-accent",
                                    )}
                                    asChild
                                >
                                    <a
                                        href={item.href}
                                        className={cn(
                                            "flex items-center",
                                            collapsed ? "justify-center" : "gap-2"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {!collapsed && <span>{item.title}</span>}
                                    </a>
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.nav>
    )
}
