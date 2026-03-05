import type { TicketPriority, TicketStatus, TicketType } from "@/model/Ticket";
import { AlertTriangle, ArrowDown, ArrowRight, ArrowUp, Bug, HelpCircle, Lightbulb, ListTodo, Wrench } from "lucide-react";

export function useMappers() {
    const priorityConfig: Record<TicketPriority, { label: string; variant: "critical" | "destructive" | "warning" | "info"; icon: React.ReactNode }> = {
        CRITICAL: { label: "Crítica", variant: "critical", icon: <AlertTriangle className="h-3 w-3" /> },
        HIGH: { label: "Alta", variant: "destructive", icon: <ArrowUp className="h-3 w-3" /> },
        MEDIUM: { label: "Media", variant: "warning", icon: <ArrowRight className="h-3 w-3" /> },
        LOW: { label: "Baja", variant: "info", icon: <ArrowDown className="h-3 w-3" /> },
    }

    const typeConfig: Record<TicketType, { label: string; icon: React.ReactNode; color: string; cardClass: string }> = {
        BUG: { label: "Bug", icon: <Bug className="h-4 w-4" />, color: "text-red-500", cardClass: "border border-2 border-red-300" },
        FEATURE: { label: "Feature", icon: <Lightbulb className="h-4 w-4" />, color: "text-yellow-500", cardClass: "border border-2 border-yellow-300" },
        IMPROVEMENT: { label: "Mejora", icon: <Wrench className="h-4 w-4" />, color: "text-blue-500", cardClass: "border border-2 border-blue-300" },
        TASK: { label: "Tarea", icon: <ListTodo className="h-4 w-4" />, color: "text-green-500", cardClass: "border border-2 border-green-300" },
        SUPPORT: { label: "Soporte", icon: <HelpCircle className="h-4 w-4" />, color: "text-purple-500", cardClass: "border border-2 border-purple-300" },
    }

    const statusConfig: Record<TicketStatus, { label: string; variant: "default" | "info" | "success" | "secondary" }> = {
        OPEN: { label: "Abierto", variant: "default" },
        IN_PROGRESS: { label: "En Progreso", variant: "info" },
        RESOLVED: { label: "Resuelto", variant: "success" },
        CLOSED: { label: "Cerrado", variant: "secondary" },
    }

    const statusOrder: TicketStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]
    return { priorityConfig, typeConfig, statusConfig, statusOrder }
}