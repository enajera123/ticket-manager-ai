'use client'

import { useTicketStore } from "@/store/useTicketStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bug, Lightbulb, ListTodo, AlertTriangle, CheckCircle } from "lucide-react"

export function TicketStats() {
    const { tickets } = useTicketStore()

    const stats = {
        total: tickets.length,
        open: tickets.filter((t) => t.status === "OPEN").length,
        inProgress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
        resolved: tickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length,
        bugs: tickets.filter((t) => t.type === "BUG").length,
        features: tickets.filter((t) => t.type === "FEATURE").length,
        critical: tickets.filter((t) => t.priority === "CRITICAL" || t.priority === "HIGH").length,
    }

    const statCards = [
        { title: "Total", value: stats.total, icon: <ListTodo className="h-4 w-4 text-muted-foreground" /> },
        { title: "Abiertos", value: stats.open, icon: <AlertTriangle className="h-4 w-4 text-yellow-500" /> },
        { title: "En Progreso", value: stats.inProgress, icon: <Lightbulb className="h-4 w-4 text-blue-500" /> },
        { title: "Resueltos", value: stats.resolved, icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
        { title: "Bugs", value: stats.bugs, icon: <Bug className="h-4 w-4 text-red-500" /> },
        { title: "Alta Prioridad", value: stats.critical, icon: <AlertTriangle className="h-4 w-4 text-red-500" /> },
    ]

    if (tickets.length === 0) return null

    return (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {statCards.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium">{stat.title}</CardTitle>
                        {stat.icon}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
