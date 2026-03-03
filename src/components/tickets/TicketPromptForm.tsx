'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTicketStore } from "@/store/useTicketStore"

const placeholders = [
    "Ej: El botón de login no funciona cuando el usuario escribe un email con mayúsculas...",
    "Ej: Necesitamos agregar un módulo de reportes con gráficos de barras...",
    "Ej: Mejorar el rendimiento de la página de dashboard, carga muy lento...",
    "Ej: Agregar validación de campos en el formulario de registro...",
    "Ej: El sistema no envía correos de confirmación después del registro...",
]

export function TicketPromptForm() {
    const { createTicketFromPrompt, isProcessing } = useTicketStore()
    const [prompt, setPrompt] = useState("")
    const [placeholder] = useState(
        () => placeholders[Math.floor(Math.random() * placeholders.length)]
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!prompt.trim() || isProcessing) return

        const ticket = await createTicketFromPrompt(prompt)
        if (ticket) {
            setPrompt("")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Generar Ticket con IA
                    </CardTitle>
                    <CardDescription>
                        Describe lo que necesitas y la IA clasificará, priorizará y estructurará tu ticket automáticamente.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={placeholder}
                                disabled={isProcessing}
                                className="min-h-[120px] pr-4 text-sm"
                                maxLength={2000}
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                                {prompt.length}/2000
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                                Presiona <kbd className="rounded border px-1 py-0.5 text-[10px] font-mono">Enter</kbd> para enviar,{" "}
                                <kbd className="rounded border px-1 py-0.5 text-[10px] font-mono">Shift + Enter</kbd> para nueva línea
                            </p>
                            <Button
                                type="submit"
                                disabled={!prompt.trim() || isProcessing}
                                className="gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Generar Ticket
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    )
}
