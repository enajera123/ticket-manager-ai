export interface TokenUsage {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
}

export interface GenerationCost {
    id?: number;
    model: string;
    promptTokens:number;
    completionTokens:number;
    totalTokens:number;
    promptCost: number;
    completionCost: number;
    totalCost: number;
    created_at?: string;
}

