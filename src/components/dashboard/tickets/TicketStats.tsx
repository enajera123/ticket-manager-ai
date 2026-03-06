import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bug, Lightbulb, ListTodo, AlertTriangle, CheckCircle } from "lucide-react"
import { useTicket } from "@/hooks/stores/useTicket"

export function TicketStats() {
    const { tickets } = useTicket()
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
        { title: "Total", value: stats.total, icon: <ListTodo className="h-4 w-4" />, borderClass: "border border-2 border-gray-200" },
        { title: "Abiertos", value: stats.open, icon: <AlertTriangle className="h-4 w-4" />, borderClass: "border border-2 border-yellow-300" },
        { title: "En Progreso", value: stats.inProgress, icon: <Lightbulb className="h-4 w-4" />, borderClass: "border border-2 border-blue-300" },
        { title: "Resueltos", value: stats.resolved, icon: <CheckCircle className="h-4 w-4" />, borderClass: "border border-2 border-green-300" },
        { title: "Bugs", value: stats.bugs, icon: <Bug className="h-4 w-4" />, borderClass: "border border-2 border-red-300" },
        { title: "Alta Prioridad", value: stats.critical, icon: <AlertTriangle className="h-4 w-4" />, borderClass: "border border-2 border-red-500" },
    ]

    if (tickets.length === 0) return null

    return (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {statCards.map((stat) => (
                <Card key={stat.title} className={`py-4 gap-0 ${stat.borderClass}`}>
                    <CardHeader className="flex flex-row items-center justify-between my-0">
                        <CardTitle className="text-xs font-medium">{stat.title}</CardTitle>
                        {stat.icon}
                    </CardHeader>
                    <CardContent className="my-0 py-0">
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
