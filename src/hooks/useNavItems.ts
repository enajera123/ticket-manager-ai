"use client"

import { BarChart3, UserCog, TicketCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/useAuthStore"
const baseNavItems = [
    {
        title: "Panel",
        href: "/dashboard",
        icon: BarChart3,
    },
    {
        title: "Tickets",
        href: "/dashboard/tickets",
        icon: TicketCheck,
    },
]
const adminNavItems = [
    {
        title: "Usuarios",
        href: "/dashboard/users",
        icon: UserCog,
        adminOnly: true,
    },
]
export function useNavItems() {
    const { getUser } = useAuthStore()
    const [navItems, setNavItems] = useState(baseNavItems)

    useEffect(() => {
        const checkUserRole = async () => {
            const user = getUser()
            if (!user) return
            try {
                if (user.role === "ADMIN")
                    setNavItems([...baseNavItems, ...adminNavItems])
            } catch (error) {
                console.error("Error al verificar el rol del usuario:", error)
            }
        }
        checkUserRole()
    }, [])

    return {
        navItems
    }
}