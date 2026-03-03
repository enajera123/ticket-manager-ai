'use client'

import { useState } from "react"
import { Settings, Key, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useTicketStore } from "@/store/useTicketStore"
import { ModelCombobox } from "./ModelCombobox"

export function TicketSettings() {
    const { apiKey, model, setApiKey, setModel } = useTicketStore()
    const [localKey, setLocalKey] = useState(apiKey)
    const [localModel, setLocalModel] = useState(model)
    const [open, setOpen] = useState(false)

    const handleSave = () => {
        setApiKey(localKey)
        setModel(localModel)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Configuración
                    {!apiKey && (
                        <span className="flex h-2 w-2 rounded-full bg-red-500" />
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Configuración de OpenRouter</DialogTitle>
                    <DialogDescription>
                        Configura tu API Key y modelo para la generación de tickets con IA.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Key className="h-4 w-4" />
                            API Key
                        </label>
                        <Input
                            type="password"
                            value={localKey}
                            onChange={(e) => setLocalKey(e.target.value)}
                            placeholder="sk-or-v1-..."
                        />
                        <p className="text-xs text-muted-foreground">
                            Obtén tu API Key en{" "}
                            <a
                                href="https://openrouter.ai/keys"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline"
                            >
                                openrouter.ai/keys
                            </a>
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Bot className="h-4 w-4" />
                            Modelo
                        </label>
                        <ModelCombobox
                            value={localModel}
                            onChange={setLocalModel}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave}>
                        Guardar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
