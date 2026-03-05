export interface PaginationType {
    page: number
    limit: number
    total: number
    totalPages: number
}

export type APIResponse<T> = {
    data: T
    message: string
    status: number
}

export interface AIUsage {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
}

export interface AICost {
    model: string;
    usage: AIUsage;
    promptCostPerMillion: number;
    completionCostPerMillion: number;
    totalCost: number;
}

export interface AIResponse<T> {
    data: T;
    cost: AICost;
}

export interface AIRequestConfig {
    apiKey: string;
    model: string;
    systemPrompt: string;
    userPrompt: string;
    temperature?: number;
    maxTokens?: number;
}