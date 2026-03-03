"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/useAuthStore"
import { User2 } from "lucide-react"
import { getInitials } from "@/lib/utils/parse"
import { useNavigate } from "react-router-dom"

export function UserProfile() {
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()

    const handleLogout = async () => {
        if (await logout()) {
            navigate("/")
        }
    }

    const userEmail = user?.email || "usuario@ejemplo.com"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="/avatars/01.png" alt={user?.name} />
                            <AvatarFallback>{user?.name ? getInitials(user?.name) : "U"}</AvatarFallback>
                        </Avatar>
                    </Button>
                </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}><User2 /> Perfil</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}