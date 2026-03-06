import supabase from "@/lib/config/supabase";
import type { GenerationCost } from "@/model/GenerationCost";
import type { PostgrestError } from "@supabase/supabase-js";

export default class GenerationCostService {
    private static instance: GenerationCostService | null = null;

    private constructor() { }
    public static getInstance(): GenerationCostService {
        GenerationCostService.instance ??= new GenerationCostService();
        return GenerationCostService.instance;
    }

    static async createGenerationCost(generationCost: GenerationCost): Promise<{ data: GenerationCost | null; error: PostgrestError | null }> {
        const { data, error } = await supabase.from("GenerationCost").insert(generationCost).select("*").single();
        if (error) {
            console.error("Error creating generationCost:", error);
            return { data: null, error };
        }
        return { data, error: null };
    }
    static async getTotalCost(): Promise<{ data: number | null; error: PostgrestError | null }> {
        const { data, error } = await supabase.from("GenerationCost").select("totalCost", { count: "exact" });
        if (error) {
            console.error("Error fetching total cost:", error);
            return { data: null, error };
        }
        const totalCost = data?.reduce((sum, item) => sum + item.totalCost, 0) ?? 0;
        return { data: totalCost, error: null };
    }
    static async getCostByModel(): Promise<{ data: Record<string, { cost: number; count: number; tokens: number }> | null; error: PostgrestError | null }> {
        const { data, error } = await supabase.from("GenerationCost").select("model, totalCost, promptTokens, completionTokens");
        if (error) {
            console.error("Error fetching cost by model:", error);
            return { data: null, error };
        }
        const map: Record<string, { cost: number; count: number; tokens: number }> = {};
        for (const c of data) {
            if (!map[c.model]) {
                map[c.model] = { cost: 0, count: 0, tokens: 0 };
            }
            map[c.model].cost += c.totalCost;
            map[c.model].count += 1;
            map[c.model].tokens += c.promptTokens + c.completionTokens;
        }
        return { data: map, error: null };
    }

}

