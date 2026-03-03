import { create } from "zustand"

interface UseLoaderState {
    isLoading: boolean
    setIsLoading: (loading: boolean) => void
    error: string | null
    setError: (error: string | null) => void
}

export const useLoaderStore = create<UseLoaderState>((set) => {
    return {
        isLoading: false,
        setIsLoading: (loading: boolean) => set({ isLoading: loading }),
        error: null,
        setError: (error: string | null) => set({ error }),
    }
})