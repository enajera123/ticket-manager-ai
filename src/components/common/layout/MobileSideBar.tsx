import { useState } from "react"
import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useNavItems } from "@/hooks/useNavItems"
import { useLocation } from "react-router-dom"

export function MobileSideBar() {
    const location = useLocation()
    const pathname = location.pathname
    const [isOpen, setIsOpen] = useState(false)
    const { navItems } = useNavItems()
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Abrir menú</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-70">
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Title</h2>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid gap-1 px-2">
                            {navItems.map((item) => (
                                <Button
                                    key={item.href}
                                    variant={pathname === item.href ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start",
                                        pathname === item.href && "bg-accent text-foreground hover:bg-accent hover:text-foreground"
                                    )}
                                    onClick={() => setIsOpen(false)}
                                    asChild
                                >
                                    <a href={item.href}>
                                        <item.icon className="mr-2 h-5 w-5" />
                                        {item.title}
                                    </a>
                                </Button>
                            ))}
                        </nav>
                    </div>
                    <div className="p-4 border-t text-center text-sm text-muted-foreground">
                        <p>{`© ${new Date().getFullYear()} All rights reserved.`}</p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}