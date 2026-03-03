export type TicketType = "BUG" | "FEATURE" | "IMPROVEMENT" | "TASK" | "SUPPORT";
export type TicketPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface Ticket {
    id: string;
    title: string;
    description: string;
    type: TicketType;
    priority: TicketPriority;
    status: TicketStatus;
    deadline: string;
    estimatedHours: number;
    tags: string[];
    originalPrompt: string;
    createdAt: string;
    updatedAt: string;
}

export interface AITicketResponse {
    title: string;
    description: string;
    type: TicketType;
    priority: TicketPriority;
    estimatedHours: number;
    deadline: string;
    tags: string[];
}

export interface TokenUsage {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
}

export interface GenerationCost {
    id: string;
    ticketId: string;
    model: string;
    usage: TokenUsage;
    promptCostPerMillion: number;
    completionCostPerMillion: number;
    totalCost: number;
    createdAt: string;
}

export interface AIClassificationResult {
    ticket: AITicketResponse;
    cost: Omit<GenerationCost, "id" | "ticketId" | "createdAt">;
}
