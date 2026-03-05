import type { TicketPriority, TicketType } from "@/model/Ticket";
import { runAI } from "../config";
import { CLASSIFY_TICKET_PROMPT } from "./prompts";
export interface AITicketResponse {
    title: string;
    description: string;
    type: TicketType;
    priority: TicketPriority;
    estimatedHours: number;
    deadline: string;
    tags: string[];
}

export function classifyTicketWithAI(prompt: string, apiKey: string, model: string) {
    const currentDate = new Date().toLocaleDateString();
    const systemPrompt = CLASSIFY_TICKET_PROMPT.replace("{{CURRENT_DATE}}", currentDate);
    return runAI<AITicketResponse>({
        apiKey,
        systemPrompt,
        model,
        userPrompt: prompt
    })
}