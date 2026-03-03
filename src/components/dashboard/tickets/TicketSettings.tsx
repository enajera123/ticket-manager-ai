'use client'

import { useState } from "react"
import { Settings, Key, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTicketStore } from "@/store/useTicketStore"
import { ModelCombobox } from "./ModelCombobox"
import { AppDialog } from "@/components/common/AppDialog"

export function TicketSettings() {
    const { apiKey, model, setApiKey, setModel } = useTicketStore()
    const [open, setOpen] = useState(false)

    const handleSave = () => {
        setOpen(false)
    }

    return (
        <AppDialog
            open={open}
            onOpenChange={setOpen}
            title="Configuración de OpenRouter"
            description="Configura tu API Key y modelo para la generación de tickets con IA."
            confirmText="Guardar"
            onConfirm={handleSave}
            onCancel={() => setOpen(false)}
            trigger={
                <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Configuración
                    {!apiKey && (
                        <span className="flex h-2 w-2 rounded-full bg-red-500" />
                    )}
                </Button>
            }
        >
            <div className="space-y-4">

                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        API Key
                    </label>
                    <Input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-or-v1-..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        Modelo
                    </label>
                    <ModelCombobox
                        value={model}
                        onChange={setModel}
                    />
                </div>

            </div>
        </AppDialog>
    )
}