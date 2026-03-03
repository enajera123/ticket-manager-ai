import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"

interface AppDialogProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void

    trigger?: ReactNode

    title: string
    description?: string

    children: ReactNode

    showFooter?: boolean
    onCancel?: () => void
    onConfirm?: () => void
    allowOutsideClick?: boolean
    cancelText?: string
    confirmText?: string

    loading?: boolean
    maxWidth?: string
}

export function AppDialog({
    open,
    onOpenChange,
    trigger,
    title,
    description,
    children,
    showFooter = true,
    onCancel,
    allowOutsideClick = true,
    onConfirm,
    cancelText = "Cancelar",
    confirmText = "Confirmar",
    loading = false,
    maxWidth = "sm:max-w-md",
}: AppDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            )}

            <DialogContent onInteractOutside={e => {
                if (!allowOutsideClick) {
                    e.preventDefault()
                }
            }} className={maxWidth}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && (
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="py-4">
                    {children}
                </div>

                {showFooter && (
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            {cancelText}
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={loading}
                        >
                            {confirmText}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}