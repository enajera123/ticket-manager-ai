import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCost, formatTokens } from '@/lib/utils/parse';
import { useGenerationCost } from '@/hooks/stores/useGenerationCost';
import { BarChart3, Cpu } from 'lucide-react';
import { useEffect, useState } from 'react';
export function BillingByModel() {
    const { getCostByModel } = useGenerationCost()
    const [generationCosts, setGenerationCosts] = useState<Record<string, { cost: number; count: number; tokens: number }>>({})
    useEffect(() => {
        getCostByModel().then(setGenerationCosts)
    }, [getCostByModel])

    const models = Object.entries(generationCosts || {}).sort((a, b) => b[1].cost - a[1].cost)

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

export default BillingByModel