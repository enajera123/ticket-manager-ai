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