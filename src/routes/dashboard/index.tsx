'use client'
import { PageTransition } from "@/components/common/layout/PageTransition"
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Suspense } from "react"
import { useTicketStore } from "@/store/useTicketStore"
import {
    TicketCheck, CheckCircle, Clock, AlertTriangle, ArrowUpCircle, TrendingDown
} from "lucide-react"
import type { TicketType } from "@/model/Ticket"
import { BillingStats } from "@/components/dashboard/panel/BillingStats"
import BillingByModel from "@/components/dashboard/panel/BillingByModel"
import { RecentGenerations } from "@/components/dashboard/panel/RecentGenerations"
import { useMappers } from "@/hooks/useMappers"

export default function DashboardPage() {
    const { tickets } = useTicketStore()
    const { typeConfig, statusConfig } = useMappers()
    const total = tickets.length
    const open = tickets.filter((t) => t.status === "OPEN").length
    const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length
    const resolved = tickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length
    const overdue = tickets.filter((t) => {
        const deadlineDate = new Date(t.deadline + "T00:00:00")
        return deadlineDate < new Date() && t.status !== "CLOSED" && t.status !== "RESOLVED"
    }).length

    // Type distribution
    const byType = tickets.reduce<Record<string, number>>((acc, t) => {
        acc[t.type] = (acc[t.type] || 0) + 1
        return acc
    }, {})

    // Recent tickets
    const recentTickets = tickets.slice(0, 5)

    // Resolution rate
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0

    const summaryCards = [
        { title: "Total Tickets", value: total, icon: <TicketCheck className="h-4 w-4 text-muted-foreground" /> },
        { title: "Abiertos", value: open, icon: <AlertTriangle className="h-4 w-4 text-yellow-500" /> },
        { title: "En Progreso", value: inProgress, icon: <Clock className="h-4 w-4 text-blue-500" /> },
        { title: "Resueltos", value: resolved, icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
        { title: "Vencidos", value: overdue, icon: <TrendingDown className="h-4 w-4 text-red-500" /> },
        { title: "Tasa Resolución", value: `${resolutionRate}%`, icon: <ArrowUpCircle className="h-4 w-4 text-emerald-500" /> },
    ]

    return (
        <PageTransition>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">
                        Resumen de tickets y costos de generación con IA
                    </p>
                </div>
                <Suspense fallback={<DashboardSkeleton />}>
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                        {summaryCards.map((stat) => (
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
                    <BillingStats />
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Distribución por Tipo</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {Object.keys(byType).length === 0 ? (
                                        <p className="text-sm text-muted-foreground">
                                            No hay tickets aún.
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {Object.entries(byType)
                                                .sort((a, b) => b[1] - a[1])
                                                .map(([type, count]) => (
                                                    <div key={type} className="flex items-center gap-3">
                                                        <div className="flex items-center gap-2 w-28">
                                                            {typeConfig[type as TicketType].icon}
                                                            <span className="text-sm font-medium">{type}</span>
                                                        </div>
                                                        <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                                                            <div
                                                                className="h-full rounded-full bg-primary transition-all"
                                                                style={{
                                                                    width: `${(count / total) * 100}%`,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-sm text-muted-foreground w-12 text-right">
                                                            {count} ({Math.round((count / total) * 100)}%)
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                            <BillingByModel />
                        </div>
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Tickets Recientes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {recentTickets.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">
                                            No hay tickets aún.
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {recentTickets.map((ticket) => (
                                                <div
                                                    key={ticket.id}
                                                    className="flex items-start gap-3 py-2 border-b last:border-0"
                                                >
                                                    <span className="mt-0.5">
                                                        {typeConfig[ticket.type].label}
                                                    </span>
                                                    <div className="flex-1 min-w-0 space-y-1">
                                                        <p className="text-sm font-medium truncate">
                                                            {ticket.title}
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <Badge
                                                                variant={statusConfig[ticket.status].variant}
                                                                className="text-[9px] h-4"
                                                            >
                                                                {statusConfig[ticket.status].label}
                                                            </Badge>
                                                            <span className="text-[10px] text-muted-foreground font-mono">
                                                                {ticket.id}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                            <RecentGenerations />
                        </div>
                    </div>
                </Suspense>
            </div>
        </PageTransition>
    )
}