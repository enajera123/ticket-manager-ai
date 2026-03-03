'use client'

import { motion, AnimatePresence } from "framer-motion"
import {
    Clock, Tag, Trash2, AlertTriangle,
    ArrowUp, ArrowRight, ArrowDown, Bug, Lightbulb, Wrench, HelpCircle, ListTodo,
    Calendar
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTicketStore } from "@/store/useTicketStore"
import type { Ticket, TicketPriority, TicketStatus, TicketType } from "@/model/Ticket"

const priorityConfig: Record<TicketPriority, { label: string; variant: "critical" | "destructive" | "warning" | "info"; icon: React.ReactNode }> = {
    CRITICAL: { label: "Crítica", variant: "critical", icon: <AlertTriangle className="h-3 w-3" /> },
    HIGH: { label: "Alta", variant: "destructive", icon: <ArrowUp className="h-3 w-3" /> },
    MEDIUM: { label: "Media", variant: "warning", icon: <ArrowRight className="h-3 w-3" /> },
    LOW: { label: "Baja", variant: "info", icon: <ArrowDown className="h-3 w-3" /> },
}

const typeConfig: Record<TicketType, { label: string; icon: React.ReactNode; color: string }> = {
    BUG: { label: "Bug", icon: <Bug className="h-4 w-4" />, color: "text-red-500" },
    FEATURE: { label: "Feature", icon: <Lightbulb className="h-4 w-4" />, color: "text-yellow-500" },
    IMPROVEMENT: { label: "Mejora", icon: <Wrench className="h-4 w-4" />, color: "text-blue-500" },
    TASK: { label: "Tarea", icon: <ListTodo className="h-4 w-4" />, color: "text-green-500" },
    SUPPORT: { label: "Soporte", icon: <HelpCircle className="h-4 w-4" />, color: "text-purple-500" },
}

const statusConfig: Record<TicketStatus, { label: string; variant: "default" | "info" | "success" | "secondary" }> = {
    OPEN: { label: "Abierto", variant: "default" },
    IN_PROGRESS: { label: "En Progreso", variant: "info" },
    RESOLVED: { label: "Resuelto", variant: "success" },
    CLOSED: { label: "Cerrado", variant: "secondary" },
}

const statusOrder: TicketStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]

function TicketCard({ ticket }: { ticket: Ticket }) {
    const { updateTicketStatus, deleteTicket } = useTicketStore()

    const priority = priorityConfig[ticket.priority]
    const type = typeConfig[ticket.type]
    const status = statusConfig[ticket.status]

    const deadlineDate = new Date(ticket.deadline + "T00:00:00")
    const now = new Date()
    const isOverdue = deadlineDate < now && ticket.status !== "CLOSED" && ticket.status !== "RESOLVED"
    const daysLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    const nextStatus = () => {
        const currentIndex = statusOrder.indexOf(ticket.status)
        if (currentIndex < statusOrder.length - 1) {
            updateTicketStatus(ticket.id, statusOrder[currentIndex + 1])
        }
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
        >
            <Card className={`hover:shadow-md transition-shadow ${isOverdue ? "border-red-300 dark:border-red-800" : ""}`}>
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <span className={type.color}>{type.icon}</span>
                            <CardTitle className="text-sm font-semibold truncate">
                                {ticket.title}
                            </CardTitle>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            <Badge variant={priority.variant} className="gap-1 text-[10px]">
                                {priority.icon}
                                {priority.label}
                            </Badge>
                            <Badge variant={status.variant} className="text-[10px]">
                                {status.label}
                            </Badge>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{ticket.id}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {ticket.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                        {ticket.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[10px] gap-1">
                                <Tag className="h-2.5 w-2.5" />
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {ticket.estimatedHours}h
                            </span>
                            <span className={`flex items-center gap-1 ${isOverdue ? "text-red-500 font-semibold" : ""}`}>
                                <Calendar className="h-3 w-3" />
                                {isOverdue ? `Vencido (${Math.abs(daysLeft)}d)` : `${daysLeft}d restantes`}
                            </span>
                        </div>
                        <span>{new Date(ticket.createdAt).toLocaleDateString("es")}</span>
                    </div>

                    <details className="text-xs">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                            Prompt original
                        </summary>
                        <p className="mt-2 p-2 bg-muted rounded text-muted-foreground italic">
                            "{ticket.originalPrompt}"
                        </p>
                    </details>

                    <div className="flex items-center gap-2 pt-2 border-t">
                        {ticket.status !== "CLOSED" && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={nextStatus}
                                className="text-xs h-7 flex-1"
                            >
                                Avanzar a {statusConfig[statusOrder[statusOrder.indexOf(ticket.status) + 1]]?.label}
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTicket(ticket.id)}
                            className="text-xs h-7 text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export function TicketList() {
    const { tickets } = useTicketStore()

    if (tickets.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
            >
                <ListTodo className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">
                    No hay tickets aún
                </h3>
                <p className="text-sm text-muted-foreground/70 mt-1">
                    Escribe un prompt arriba para generar tu primer ticket con IA
                </p>
            </motion.div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
                {tickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                ))}
            </AnimatePresence>
        </div>
    )
}
