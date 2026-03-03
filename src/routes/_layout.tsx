import type React from "react"
import { Toaster } from "@/components/ui/sonner"
import { MotionConfig } from "framer-motion"

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex flex-col min-h-screen relative">
            <MotionConfig reducedMotion="user">
                {children}
                <Toaster
                    toastOptions={{
                        unstyled: true,
                        classNames: {
                            toast: "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full mt-4",
                            cancelButton: "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-xs font-medium",
                            closeButton: "absolute right-2 top-2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2",
                            description: "text-gray-600 text-sm",
                            default: "bg-card border-border text-gray-900 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gray-500",
                            success: "bg-card border-border text-gray-900 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-green-500",
                            error: "bg-card border-border text-gray-900 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-red-500",
                            info: "bg-card border-border text-gray-900 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-blue-500",
                            warning: "bg-card border-border text-gray-900 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-yellow-500",
                        },
                    }}
                />
            </MotionConfig>
        </div>
    );
}