export type TicketType = "BUG" | "FEATURE" | "IMPROVEMENT" | "TASK" | "SUPPORT";
export type TicketPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface Ticket {
    id: string;
    projectId: string;
    title: string;
    description: string;
    type: TicketType;
    priority: TicketPriority;
    status: TicketStatus;
    deadline: string;
    estimatedHours: number;
    tags: string[];
    assignedTo?: string; // Member ID
    originalPrompt: string;
    createdAt: string;
    updatedAt: string;
}
export interface TokenUsage {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
}

export interface GenerationCost {
    id: string;
    model: string;
    usage: TokenUsage;
    promptCostPerMillion: number;
    completionCostPerMillion: number;
    totalCost: number;
    createdAt: string;
}

