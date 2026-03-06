import { motion } from "framer-motion"
import {
    Clock, Tag, Trash2, Calendar, Pencil
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTicketStore } from "@/store/useTicketStore"
import type { Ticket } from "@/model/Ticket"
import { getDaysLeft } from "@/lib/utils/date"
import { showConfirmationAlert } from "@/lib/utils/alert"
import { useMappers } from "@/hooks/useMappers"

export function TicketCard({ ticket, onEdit }: { ticket: Required<Ticket>; onEdit: (ticket: Ticket) => void }) {
    const { priorityConfig, typeConfig, statusConfig, statusOrder } = useMappers()
    const { updateTicket, deleteTicket } = useTicketStore()
    const priority = priorityConfig[ticket.priority]
    const type = typeConfig[ticket.type]
    const status = statusConfig[ticket.status]

    const deadlineDate = new Date(ticket.deadline + "T00:00:00")
    const isOverdue = deadlineDate < new Date() && ticket.status !== "CLOSED" && ticket.status !== "RESOLVED"
    const daysLeft = getDaysLeft(deadlineDate)

    const nextStatus = () => {
        const currentIndex = statusOrder.indexOf(ticket.status)
        if (currentIndex < statusOrder.length - 1) {
            const nextStatus = statusOrder[currentIndex + 1]
            updateTicket(ticket.id, { status: nextStatus } as Ticket)
        }
    }
    const handleDelete = async () => {
        const confirmation = await showConfirmationAlert("¿Eliminar ticket?", "Esta acción no se puede deshacer. ¿Deseas continuar?");
        if (!confirmation.isConfirmed) return;
        deleteTicket(ticket.id);
    }
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
        >
            <Card className={`hover:shadow-md transition-shadow ${type.cardClass} ${isOverdue ? "border-red-300 dark:border-red-800" : ""}`}>
                <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <span className={type.color}>{type.icon}</span>
                            <CardTitle className="text-sm font-semibold truncate">
                                {ticket.title}
                            </CardTitle>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{ticket.id}</p>
                    <div className="flex gap-1 shrink-0">
                        <Badge variant={priority.variant} className="gap-1 text-[10px]">
                            {priority.icon}
                            {priority.label}
                        </Badge>
                        <Badge variant={status.variant} className="text-[10px]">
                            {status.label}
                        </Badge>
                    </div>
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
                        <span>{new Date(ticket.created_at).toLocaleDateString("es")}</span>
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
                            onClick={() => onEdit(ticket)}
                            className="text-xs h-7"
                        >
                            <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDelete}
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
