export function getInitials(name: string): string {
    return name
        .split(" ")
        .filter(n => n.length > 0)
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
}
export function formatCost(cost: number): string {
    if (cost === 0) return "$0.00"
    if (cost < 0.001) return `$${cost.toFixed(6)}`
    if (cost < 0.01) return `$${cost.toFixed(4)}`
    return `$${cost.toFixed(4)}`
}

export function formatTokens(tokens: number): string {
    if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`
    if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(1)}K`
    return tokens.toString()
}
