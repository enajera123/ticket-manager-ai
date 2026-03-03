"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useNavItems } from "@/hooks/useNavItems"
import { useLocation, useNavigate } from "react-router-dom"

export function BottomNav() {
    const location = useLocation()
    const pathname = location.pathname
    const navigate = useNavigate()
    const { navItems } = useNavItems()
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
            <nav className="flex items-center justify-around px-2 py-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/dashboard" && pathname.startsWith(item.href))

                    return (
                        <motion.button
                            key={item.href}
                            onClick={() => navigate(item.href)}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-0 flex-1",
                                isActive
                                    ? "text-foreground bg-accent"
                                    : "text-foreground hover:text-foreground hover:bg-accent"
                            )}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 mb-1",
                                isActive && "text-foreground"
                            )} />
                            <span className={cn(
                                "text-xs font-medium truncate",
                                isActive && "text-foreground"
                            )}>
                                {item.title}
                            </span>
                        </motion.button>
                    )
                })}
            </nav>
        </div>
    )
}