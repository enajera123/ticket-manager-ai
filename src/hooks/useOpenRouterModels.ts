'use client'

import { useState, useEffect, useCallback, useRef } from "react"

export interface OpenRouterModel {
    id: string
    name: string
    description: string
    context_length: number
    pricing: {
        prompt: string
        completion: string
    }
}

interface UseOpenRouterModelsReturn {
    models: OpenRouterModel[]
    visibleModels: OpenRouterModel[]
    isLoading: boolean
    error: string | null
    search: string
    setSearch: (s: string) => void
    loadMore: () => void
    hasMore: boolean
    totalFiltered: number
}

const PAGE_SIZE = 30
const CACHE_KEY = "openrouter-models-cache"
const CACHE_TTL = 1000 * 60 * 60 // 1 hour

function getCachedModels(): OpenRouterModel[] | null {
    try {
        const raw = localStorage.getItem(CACHE_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw)
        if (Date.now() - parsed.timestamp > CACHE_TTL) {
            localStorage.removeItem(CACHE_KEY)
            return null
        }
        return parsed.data
    } catch {
        return null
    }
}

function setCachedModels(models: OpenRouterModel[]) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: models, timestamp: Date.now() }))
    } catch { /* ignore quota errors */ }
}

export function useOpenRouterModels(): UseOpenRouterModelsReturn {
    const [allModels, setAllModels] = useState<OpenRouterModel[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const fetchedRef = useRef(false)

    // Fetch all models once
    useEffect(() => {
        if (fetchedRef.current) return
        fetchedRef.current = true

        const cached = getCachedModels()
        if (cached) {
            setAllModels(cached)
            return
        }

        setIsLoading(true)
        fetch("https://openrouter.ai/api/v1/models")
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
            })
            .then((data) => {
                const models: OpenRouterModel[] = (data.data || []).map((m: any) => ({
                    id: m.id,
                    name: m.name,
                    description: m.description || "",
                    context_length: m.context_length || 0,
                    pricing: {
                        prompt: m.pricing?.prompt || "0",
                        completion: m.pricing?.completion || "0",
                    },
                }))
                // Sort by name
                models.sort((a, b) => a.name.localeCompare(b.name))
                setAllModels(models)
                setCachedModels(models)
            })
            .catch((err) => setError(err.message))
            .finally(() => setIsLoading(false))
    }, [])

    // Reset page when search changes
    useEffect(() => {
        setPage(1)
    }, [search])

    // Filter models by search term
    const filtered = allModels.filter((m) => {
        if (!search.trim()) return true
        const q = search.toLowerCase()
        return (
            m.id.toLowerCase().includes(q) ||
            m.name.toLowerCase().includes(q)
        )
    })

    const visibleModels = filtered.slice(0, page * PAGE_SIZE)
    const hasMore = visibleModels.length < filtered.length

    const loadMore = useCallback(() => {
        if (hasMore) {
            setPage((p) => p + 1)
        }
    }, [hasMore])

    return {
        models: allModels,
        visibleModels,
        isLoading,
        error,
        search,
        setSearch,
        loadMore,
        hasMore,
        totalFiltered: filtered.length,
    }
}
