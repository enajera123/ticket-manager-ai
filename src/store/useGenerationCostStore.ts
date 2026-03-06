import { create } from "zustand";
import { toast } from "sonner";
import type { GenerationCost } from "@/model/GenerationCost";
import GenerationCostService from "@/services/generationCost";

interface GenerationCostState {
    generationCosts: GenerationCost[];
    createGenerationCost: (generationCost: GenerationCost) => Promise<GenerationCost | null>;
    getCostByModel: () => Promise<Record<string, { cost: number; count: number; tokens: number }>>;
    getTotalCost: () => Promise<number>;
}

export const useGenerationCostStore = create<GenerationCostState>((set) => {
    return {
        generationCosts: [],
        currentGenerationCost: null,
        createGenerationCost: async (generationCost) => {
            const { data, error } = await GenerationCostService.createGenerationCost(generationCost);
            if (!data) {
                toast.error("Error al crear el proyecto", {
                    description: error?.message || "Ocurrió un error desconocido",
                });
                return null;
            }
            set((state) => ({
                generationCosts: [data, ...state.generationCosts],
            }));

            return data;
        },
        getCostByModel: async () => {
            const { data, error } = await GenerationCostService.getCostByModel();
            if (!data) {
                toast.error("Error al obtener el costo por modelo", {
                    description: error?.message || "Ocurrió un error desconocido",
                });
                return {};
            }
            return data;
        },
        getTotalCost: async () => {
            const { data, error } = await GenerationCostService.getTotalCost();
            if (!data) {
                toast.error("Error al obtener el costo total", {
                    description: error?.message || "Ocurrió un error desconocido",
                });
                return 0;
            }
            return data;
        }
    }
})


