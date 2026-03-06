import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OpenRouterModel } from "@/model/openRouter/Model";
import { fetchData } from "@/lib/utils/fetch";
const CACHE_KEY = "openrouter-models-cache";
interface OpenRouterModelState {
    openRouterModels: OpenRouterModel[];
    setOpenRouterModels: (models: OpenRouterModel[]) => void;
    openRouterVisibleModels: OpenRouterModel[];
    page: number;
    pageSize: number;
    setPage: (page: number) => void;
    setOpenRouterVisibleModels: (models: OpenRouterModel[]) => void;
    search: string;
    setSearch: (s: string) => void;
    totalFiltered: number;
    fetchModels: () => Promise<void>;
}

export const useOpenRouterModelStore = create<OpenRouterModelState>()(
    persist(
        (set) => ({
            openRouterModels: [],
            openRouterVisibleModels: [],
            page: 1,
            pageSize: 30,
            setPage: (page: number) => set({ page }),
            isLoading: false,
            error: null,
            search: "",
            fetchModels: async () => {
                try {
                    const response = await fetchData("https://openrouter.ai/api/v1/models", "GET") as { data: OpenRouterModel[] };
                    if (!response) {
                        throw new Error("No se pudo obtener la lista de modelos. Por favor, intenta de nuevo más tarde.");
                    }
                    const models = response.data
                    models.sort((a, b) => a.name.localeCompare(b.name));
                    set({ openRouterModels: models });
                } catch (err) {
                    console.error("Error fetching OpenRouter models:", err);
                    throw err instanceof Error ? err : new Error("Unknown error");
                }
            },
            setSearch: (s: string) => set({ search: s }),
            setOpenRouterModels: (models: OpenRouterModel[]) => set({ openRouterModels: models }),
            setOpenRouterVisibleModels: (models: OpenRouterModel[]) => set({ openRouterVisibleModels: models }),
            totalFiltered: 0,
        }),
        {
            name: CACHE_KEY,
            version: 1,
            partialize: (state) => ({
                openRouterModels: state.openRouterModels,
                openRouterVisibleModels: state.openRouterVisibleModels,
                search: state.search,
                totalFiltered: state.totalFiltered,
            }),
        }
    )
);
