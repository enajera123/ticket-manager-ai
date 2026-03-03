'use client'

import { useState, useRef, useCallback, useEffect } from "react"
import { Check, ChevronsUpDown, Loader2, Search, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useOpenRouterModels } from "@/hooks/useOpenRouterModels"
import { useDebounce } from "@/hooks/useDebounce"

interface ModelComboboxProps {
    value: string
    onChange: (value: string) => void
}

function formatPrice(price: string): string {
    const num = parseFloat(price)
    if (num === 0) return "Gratis"
    if (num < 0.000001) return `$${(num * 1_000_000).toFixed(3)}/M`
    return `$${(num * 1_000_000).toFixed(2)}/M`
}

function formatContext(ctx: number): string {
    if (ctx >= 1_000_000) return `${(ctx / 1_000_000).toFixed(1)}M`
    if (ctx >= 1_000) return `${(ctx / 1_000).toFixed(0)}K`
    return `${ctx}`
}

export function ModelCombobox({ value, onChange }: ModelComboboxProps) {
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const debouncedSearch = useDebounce(inputValue, 250)
    const listRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const {
        visibleModels,
        isLoading,
        error,
        setSearch,
        loadMore,
        hasMore,
        totalFiltered,
    } = useOpenRouterModels()

    // Sync debounced search
    useEffect(() => {
        setSearch(debouncedSearch)
    }, [debouncedSearch, setSearch])

    // Close dropdown on outside click
    useEffect(() => {
        if (!open) return
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [open])

    // Infinite scroll handler
    const handleScroll = useCallback(() => {
        const el = listRef.current
        if (!el || !hasMore) return
        const { scrollTop, scrollHeight, clientHeight } = el
        if (scrollHeight - scrollTop - clientHeight < 100) {
            loadMore()
        }
    }, [hasMore, loadMore])

    const selectedModel = visibleModels.find((m) => m.id === value) ??
        { id: value, name: value || "Seleccionar modelo..." }

    return (
        <div ref={containerRef} className="relative">
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
                className="w-full justify-between h-auto min-h-10 py-2 font-normal"
            >
                <span className="truncate text-left text-sm">
                    {value ? selectedModel.name : "Seleccionar modelo..."}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>

            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
                    {/* Search input */}
                    <div className="flex items-center border-b px-3 py-2">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Buscar modelo..."
                            className="border-0 p-0 h-8 text-sm shadow-none focus-visible:ring-0"
                            autoFocus
                        />
                        {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin opacity-50" />}
                    </div>

                    {/* Results count */}
                    <div className="px-3 py-1.5 text-[10px] text-muted-foreground border-b">
                        {totalFiltered} modelos encontrados
                    </div>

                    {/* Scrollable list */}
                    <div
                        ref={listRef}
                        onScroll={handleScroll}
                        className="max-h-[280px] overflow-y-auto"
                    >
                        {error && (
                            <div className="px-3 py-6 text-center text-sm text-destructive">
                                Error: {error}
                            </div>
                        )}

                        {!isLoading && visibleModels.length === 0 && !error && (
                            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                                No se encontraron modelos
                            </div>
                        )}

                        {visibleModels.map((model) => {
                            const isFree = parseFloat(model.pricing.prompt) === 0
                            return (
                                <button
                                    key={model.id}
                                    onClick={() => {
                                        onChange(model.id)
                                        setOpen(false)
                                        setInputValue("")
                                    }}
                                    className={cn(
                                        "flex w-full items-start gap-2 px-3 py-2.5 text-left hover:bg-accent transition-colors cursor-pointer",
                                        value === model.id && "bg-accent"
                                    )}
                                >
                                    <Check
                                        className={cn(
                                            "mt-0.5 h-4 w-4 shrink-0",
                                            value === model.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm font-medium truncate">
                                                {model.name}
                                            </span>
                                            {isFree && (
                                                <Badge variant="success" className="text-[9px] px-1.5 py-0 h-4 gap-0.5">
                                                    <Sparkles className="h-2.5 w-2.5" />
                                                    Free
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] text-muted-foreground font-mono truncate">
                                                {model.id}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                                            <span className="flex items-center gap-0.5">
                                                <Zap className="h-2.5 w-2.5" />
                                                {formatContext(model.context_length)} ctx
                                            </span>
                                            <span>
                                                In: {formatPrice(model.pricing.prompt)}
                                            </span>
                                            <span>
                                                Out: {formatPrice(model.pricing.completion)}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            )
                        })}

                        {hasMore && (
                            <div className="px-3 py-2 text-center">
                                <Loader2 className="h-4 w-4 animate-spin mx-auto text-muted-foreground" />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
