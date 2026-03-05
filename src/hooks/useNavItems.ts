import { BarChart3, UserCog, TicketCheck, Settings, FolderOpen, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/useAuthStore"
const baseNavItems = [
    {
        title: "Panel",
        href: "/dashboard",
        icon: BarChart3,
    },
    {
        title: "Proyectos",
        href: "/dashboard/projects",
        icon: FolderOpen,
    },
    {
        title: "Miembros",
        href: "/dashboard/members",
        icon: Users,
    },
    {
        title: "Tickets",
        href: "/dashboard/tickets",
        icon: TicketCheck,
    },
    {
        title: "Configuración",
        href: "/dashboard/config",
        icon: Settings,
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