import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTicket } from "@/hooks/stores/useTicket"
import { formatCost, formatTokens } from "@/lib/utils/parse"
import { Zap } from "lucide-react"

export function RecentGenerations() {
    const { generationCosts } = useTicket()

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