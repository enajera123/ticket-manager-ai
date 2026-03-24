import { useGenerationCostStore } from "@/store/useGenerationCostStore"

/**
 * Hook for generation cost operations.
 * Provides access to cost tracking and statistics.
 */
export function useGenerationCost() {
  const generationCosts = useGenerationCostStore((s) => s.generationCosts)
  const createGenerationCost = useGenerationCostStore((s) => s.createGenerationCost)
  const getCostByModel = useGenerationCostStore((s) => s.getCostByModel)
  const getTotalCost = useGenerationCostStore((s) => s.getTotalCost)

  return {
    generationCosts,
    createGenerationCost,
    getCostByModel,
    getTotalCost,
  }
}