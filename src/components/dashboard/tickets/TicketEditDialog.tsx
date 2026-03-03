'use client'

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTicketStore } from "@/store/useTicketStore"
import type { Ticket, TicketType, TicketPriority, TicketStatus } from "@/model/Ticket"
import { X } from "lucide-react"

const ticketTypes: { value: TicketType; label: string }[] = [
    { value: "BUG", label: "Bug" },
    { value: "FEATURE", label: "Feature" },
    { value: "IMPROVEMENT", label: "Mejora" },
    { value: "TASK", label: "Tarea" },
    { value: "SUPPORT", label: "Soporte" },
]

const ticketPriorities: { value: TicketPriority; label: string }[] = [
    { value: "CRITICAL", label: "Crítica" },
    { value: "HIGH", label: "Alta" },
    { value: "MEDIUM", label: "Media" },
    { value: "LOW", label: "Baja" },
]

const ticketStatuses: { value: TicketStatus; label: string }[] = [
    { value: "OPEN", label: "Abierto" },
    { value: "IN_PROGRESS", label: "En Progreso" },
    { value: "RESOLVED", label: "Resuelto" },
    { value: "CLOSED", label: "Cerrado" },
]

interface TicketEditDialogProps {
    ticket: Ticket | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function TicketEditDialog({ ticket, open, onOpenChange }: TicketEditDialogProps) {
    const { updateTicket } = useTicketStore()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [type, setType] = useState<TicketType>("TASK")
    const [priority, setPriority] = useState<TicketPriority>("MEDIUM")
    const [status, setStatus] = useState<TicketStatus>("OPEN")
    const [deadline, setDeadline] = useState("")
    const [estimatedHours, setEstimatedHours] = useState(0)
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState("")

    useEffect(() => {
        if (ticket) {
            setTitle(ticket.title)
            setDescription(ticket.description)
            setType(ticket.type)
            setPriority(ticket.priority)
            setStatus(ticket.status)
            setDeadline(ticket.deadline)
            setEstimatedHours(ticket.estimatedHours)
            setTags([...ticket.tags])
            setTagInput("")
        }
    }, [ticket])

    const addTag = () => {
        const trimmed = tagInput.trim()
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed])
            setTagInput("")
        }
    }

    const removeTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag))
    }

    const handleSave = () => {
        if (!ticket) return
        updateTicket(ticket.id, {
            title,
            description,
            type,
            priority,
            status,
            deadline,
            estimatedHours,
            tags,
        })
        onOpenChange(false)
    }

    if (!ticket) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar Ticket</DialogTitle>
                    <DialogDescription className="font-mono text-xs">
                        {ticket.id}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <label htmlFor="edit-title" className="text-sm font-medium">Título</label>
                        <Input
                            id="edit-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Título del ticket"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label htmlFor="edit-description" className="text-sm font-medium">Descripción</label>
                        <Textarea
                            id="edit-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descripción detallada"
                            className="min-h-25"
                        />
                    </div>

                    {/* Type & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="edit-type" className="text-sm font-medium">Tipo</label>
                            <select
                                id="edit-type"
                                value={type}
                                onChange={(e) => setType(e.target.value as TicketType)}
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                {ticketTypes.map((t) => (
                                    <option key={t.value} value={t.value}>
                                        {t.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="edit-priority" className="text-sm font-medium">Prioridad</label>
                            <select
                                id="edit-priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                {ticketPriorities.map((p) => (
                                    <option key={p.value} value={p.value}>
                                        {p.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <label htmlFor="edit-status" className="text-sm font-medium">Estado</label>
                        <select
                            id="edit-status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as TicketStatus)}
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            {ticketStatuses.map((s) => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Deadline & Hours */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="edit-deadline" className="text-sm font-medium">Fecha límite</label>
                            <Input
                                id="edit-deadline"
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="edit-hours" className="text-sm font-medium">Horas estimadas</label>
                            <Input
                                id="edit-hours"
                                type="number"
                                min={0}
                                step={0.5}
                                value={estimatedHours}
                                onChange={(e) => setEstimatedHours(parseFloat(e.target.value) || 0)}
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <label htmlFor="edit-tag-input" className="text-sm font-medium">Tags</label>
                        <div className="flex flex-wrap gap-1 mb-2">
                            {tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="ml-0.5 rounded-full hover:bg-muted p-0.5"
                                    >
                                        <X className="h-2.5 w-2.5" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                id="edit-tag-input"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                placeholder="Agregar tag..."
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        addTag()
                                    }
                                }}
                            />
                            <Button type="button" variant="outline" size="sm" onClick={addTag}>
                                Agregar
                            </Button>
                        </div>
                    </div>

                    {/* Original Prompt (read-only) */}
                    <div className="space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">
                            Prompt original
                        </span>
                        <p className="text-sm p-3 bg-muted rounded-md text-muted-foreground italic">
                            "{ticket.originalPrompt}"
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={!title.trim()}>
                        Guardar cambios
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
