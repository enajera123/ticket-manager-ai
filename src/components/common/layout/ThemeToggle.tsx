import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ThemeToggle() {
    const [theme, setTheme] = useState<string>(() => {
        try {
            return localStorage.getItem("theme") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        } catch {
            return "light"
        }
    })

    useEffect(() => {
        const root = document.documentElement
        if (theme === "dark") root.classList.add("dark")
        else root.classList.remove("dark")
        try { localStorage.setItem("theme", theme) } catch { }
    }, [theme])

    return (
        <Button variant="ghost" onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")} aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </Button>
    )
}