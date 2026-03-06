import { useState, useRef, useEffect, useCallback } from "react"
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface GenericComboboxProps<T> {
    items: T[]
    value: string
    onChange: (value: string) => void
    getValue: (item: T) => string
    getLabel: (item: T) => string
    renderItem?: (item: T, selected: boolean) => React.ReactNode
    isLoading?: boolean
    hasMore?: boolean
    onLoadMore?: () => void
    placeholder?: string
    searchPlaceholder?: string
    onSearch?: (value: string) => void
    totalCount?: number
}

export function GenericCombobox<T>({
    items,
    value,
    onChange,
    getValue,
    getLabel,
    renderItem,
    isLoading,
    hasMore,
    onLoadMore,
    placeholder = "Seleccionar...",
    searchPlaceholder = "Buscar...",
    onSearch,
    totalCount,
}: GenericComboboxProps<T>) {

    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const listRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const selectedItem = items.find(i => getValue(i) === value)

    // Outside click
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

    const handleScroll = useCallback(() => {
        const el = listRef.current
        if (!el || !hasMore || !onLoadMore) return
        const { scrollTop, scrollHeight, clientHeight } = el
        if (scrollHeight - scrollTop - clientHeight < 100) {
            onLoadMore()
        }
    }, [hasMore, onLoadMore])

    return (
        <div ref={containerRef} className="relative">
            <Button
                variant="outline"
                onClick={() => setOpen(!open)}
                className="w-full justify-between"
            >
                <span className="truncate text-sm">
                    {selectedItem ? getLabel(selectedItem) : placeholder}
                </span>
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </Button>

            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">

                    {/* Search */}
                    {onSearch && (
                        <div className="flex items-center border-b px-3 py-2">
                            <Search className="mr-2 h-4 w-4 opacity-50" />
                            <Input
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value)
                                    onSearch(e.target.value)
                                }}
                                placeholder={searchPlaceholder}
                                className="border-0 h-8 text-sm shadow-none focus-visible:ring-0"
                            />
                            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin opacity-50" />}
                        </div>
                    )}

                    {totalCount !== undefined && (
                        <div className="px-3 py-1 text-xs text-muted-foreground border-b">
                            {totalCount} resultados
                        </div>
                    )}

                    {/* List */}
                    <div
                        ref={listRef}
                        onScroll={handleScroll}
                        className={cn(
                            "max-h-70 overflow-y-auto",
                            "scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted scrollbar-track-transparent",
                            "custom-scroll"
                        )}
                    >
                        {items.map(item => {
                            const itemValue = getValue(item)
                            const selected = itemValue === value

                            return (
                                <button
                                    key={itemValue}
                                    onClick={() => {
                                        onChange(itemValue)
                                        setOpen(false)
                                        setInputValue("")
                                    }}
                                    className={cn(
                                        "flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-accent",
                                        selected && "bg-accent"
                                    )}
                                >
                                    <Check className={cn(
                                        "h-4 w-4",
                                        selected ? "opacity-100" : "opacity-0"
                                    )} />
                                    <div className="flex-1">
                                        {renderItem
                                            ? renderItem(item, selected)
                                            : <span className="text-sm">{getLabel(item)}</span>
                                        }
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