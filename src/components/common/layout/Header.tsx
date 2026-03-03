import { ChevronLeft, Menu } from 'lucide-react'
import { MobileSideBar } from './MobileSideBar'
import { UserProfile } from './UserNav'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/lib/constants/config'
import ThemeToggle from './ThemeToggle'
interface HeaderProps {
    collapsed: boolean
    setCollapsed: (collapsed: boolean) => void
}
function Header({ collapsed, setCollapsed }: HeaderProps) {

    return (
        <header className="sticky top-0 z-40 border-b ">
            <div className="bg-card flex h-16 items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-2">
                    <MobileSideBar />
                    <Button className='hidden md:flex' onClick={() => setCollapsed(!collapsed)} variant={"outline"}>
                        {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
                    </Button>
                    <a href="/dashboard" className="flex items-center gap-2">
                        <h1 className="text-xl font-bold hidden md:block">
                            🤖 {APP_NAME}
                        </h1>
                    </a>
                </div>
                <div className="flex items-center gap-4">
                    <UserProfile />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}

export default Header