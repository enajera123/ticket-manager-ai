'use client'

import type { OpenRouterModel } from "@/model/openRouter/Model"
import { useLoaderStore } from "@/store/useLoaderStore"
import { useOpenRouterModelStore } from "@/store/useOpenRouterModelStore"
import { useEffect, useCallback, useRef } from "react"

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

export function useOpenRouterModels(): UseOpenRouterModelsReturn {
    const {
        openRouterModels,
        fetchModels,
        search,
        page,
        setPage,
        setSearch,
        pageSize,
    } = useOpenRouterModelStore()
    const { error, isLoading, setError, setIsLoading } = useLoaderStore()
    const fetchedRef = useRef(false)

    useEffect(() => {
        if (fetchedRef.current) return
        fetchedRef.current = true
        setIsLoading(true)
        fetchModels().catch((err) => {
            console.error("Error fetching OpenRouter models:", err)
            setError(err instanceof Error ? err.message : "Unknown error")
        }).finally(() => setIsLoading(false))
    }, [])

    useEffect(() => {
        setPage(1)
    }, [search])

    const filtered = openRouterModels.filter((m) => {
        if (!search.trim()) return true
        const q = search.toLowerCase()
        return (
            m.id.toLowerCase().includes(q) ||
            m.name.toLowerCase().includes(q)
        )
    })

    const visibleModels = filtered.slice(0, page * pageSize)
    const hasMore = visibleModels.length < filtered.length

    const loadMore = useCallback(() => {
        if (hasMore) {
            setPage(page + 1)
        }
    }, [hasMore])

    return {
        models: openRouterModels,
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
