import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Zap, TrendingUp, Hash } from "lucide-react"
import { formatCost, formatTokens } from "@/lib/utils/parse"
import { useTicket } from "@/hooks/stores/useTicket"
import { useGenerationCost } from "@/hooks/stores/useGenerationCost"


export function BillingStats() {
    const { tickets } = useTicket()
    const { generationCosts } = useGenerationCost()
    const totalCost = generationCosts.reduce((sum, c) => sum + c.totalCost, 0)
    const totalTokens = generationCosts.reduce((sum, c) => sum + c.totalTokens, 0)
    const totalPromptTokens = generationCosts.reduce((sum, c) => sum + c.promptTokens, 0)
    const totalCompletionTokens = generationCosts.reduce((sum, c) => sum + c.completionTokens, 0)
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



