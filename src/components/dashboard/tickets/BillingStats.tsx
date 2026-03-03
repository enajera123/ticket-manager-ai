'use client'

import { useTicketStore } from "@/store/useTicketStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Cpu, Zap, TrendingUp, BarChart3, Hash } from "lucide-react"

function formatCost(cost: number): string {
    if (cost === 0) return "$0.00"
    if (cost < 0.001) return `$${cost.toFixed(6)}`
    if (cost < 0.01) return `$${cost.toFixed(4)}`
    return `$${cost.toFixed(4)}`
}

function formatTokens(tokens: number): string {
    if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`
    if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(1)}K`
    return tokens.toString()
}

export function BillingStats() {
    const { generationCosts, tickets } = useTicketStore()

    const totalCost = generationCosts.reduce((sum, c) => sum + c.totalCost, 0)
    const totalTokens = generationCosts.reduce((sum, c) => sum + c.usage.totalTokens, 0)
    const totalPromptTokens = generationCosts.reduce((sum, c) => sum + c.usage.promptTokens, 0)
    const totalCompletionTokens = generationCosts.reduce((sum, c) => sum + c.usage.completionTokens, 0)
    const totalGenerations = generationCosts.length
    const avgCostPerTicket = totalGenerations > 0 ? totalCost / totalGenerations : 0

    const statCards = [
        {
            title: "Gasto Total",
            value: formatCost(totalCost),
            description: `${totalGenerations} generaciones`,
            icon: <DollarSign className="h-4 w-4 text-green-500" />,
        },
        {
            title: "Tokens Totales",
            value: formatTokens(totalTokens),
            description: `${formatTokens(totalPromptTokens)} prompt / ${formatTokens(totalCompletionTokens)} completion`,
            icon: <Zap className="h-4 w-4 text-yellow-500" />,
        },
        {
            title: "Costo Promedio",
            value: formatCost(avgCostPerTicket),
            description: "por generación",
            icon: <TrendingUp className="h-4 w-4 text-blue-500" />,
        },
        {
            title: "Generaciones",
            value: totalGenerations,
            description: `de ${tickets.length} tickets`,
            icon: <Hash className="h-4 w-4 text-purple-500" />,
        },
    ]

    return (
        <div className="space-y-4">
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium">{stat.title}</CardTitle>
                            {stat.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export function BillingByModel() {
    const { generationCosts } = useTicketStore()

    // Group by model
    const modelMap: Record<string, { cost: number; count: number; tokens: number }> = {}
    for (const c of generationCosts) {
        if (!modelMap[c.model]) {
            modelMap[c.model] = { cost: 0, count: 0, tokens: 0 }
        }
        modelMap[c.model].cost += c.totalCost
        modelMap[c.model].count += 1
        modelMap[c.model].tokens += c.usage.totalTokens
    }

    const models = Object.entries(modelMap).sort((a, b) => b[1].cost - a[1].cost)

    if (models.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Cpu className="h-4 w-4" />
                        Costos por Modelo
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        No hay datos de costos aún. Genera un ticket para comenzar.
                    </p>
                </CardContent>
            </Card>
        )
    }

    const maxCost = Math.max(...models.map(([, v]) => v.cost))

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Costos por Modelo
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {models.map(([model, data]) => (
                    <div key={model} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                            <span className="truncate font-medium max-w-[60%]" title={model}>
                                {model.split("/").pop() || model}
                            </span>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span>{data.count} gen.</span>
                                <span>{formatTokens(data.tokens)} tokens</span>
                                <span className="font-semibold text-foreground">
                                    {formatCost(data.cost)}
                                </span>
                            </div>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{
                                    width: maxCost > 0 ? `${(data.cost / maxCost) * 100}%` : "0%",
                                }}
                            />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

export function RecentGenerations() {
    const { generationCosts } = useTicketStore()

    const recent = generationCosts.slice(0, 10)

    if (recent.length === 0) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Últimas Generaciones
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {recent.map((cost) => (
                        <div
                            key={cost.id}
                            className="flex items-center justify-between text-sm py-1.5 border-b last:border-0"
                        >
                            <div className="flex flex-col gap-0.5">
                                <span className="font-medium text-xs truncate max-w-50">
                                    {cost.model.split("/").pop() || cost.model}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-mono">
                                    {cost.ticketId}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span>{formatTokens(cost.usage.totalTokens)} tokens</span>
                                <span className="font-semibold text-foreground">
                                    {formatCost(cost.totalCost)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
