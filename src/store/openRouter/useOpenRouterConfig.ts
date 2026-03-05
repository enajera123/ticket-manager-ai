import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UseOpenRouterConfigState {
    apiKey: string
    setApiKey: (key: string) => void
    model: string
    setModel: (model: string) => void
}

export const useOpenRouterConfigStore = create<UseOpenRouterConfigState>()(
    persist(
        (set, _get) => ({
            apiKey: "",
            setApiKey: (key: string) => set({ apiKey: key }),
            model: "",
            setModel: (model: string) => set({ model }),

        }),
        {
            name: "openrouter-config-store",
            partialize: (state) => ({
                apiKey: state.apiKey,
                model: state.model,
            }),
        }
    )
)
