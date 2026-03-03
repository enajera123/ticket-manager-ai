import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import type { Ticket, TicketStatus, GenerationCost } from "@/model/Ticket";
import { classifyTicketWithAI } from "@/a/openrouter";

interface TicketState {
    tickets: Ticket[];
    generationCosts: GenerationCost[];
    isProcessing: boolean;
    apiKey: string;
    model: string;
    setApiKey: (key: string) => void;
    setModel: (model: string) => void;
    createTicketFromPrompt: (prompt: string) => Promise<Ticket | null>;
    updateTicketStatus: (id: string, status: TicketStatus) => void;
    updateTicket: (id: string, updates: Partial<Omit<Ticket, "id" | "createdAt" | "originalPrompt">>) => void;
    deleteTicket: (id: string) => void;
    getTicketById: (id: string) => Ticket | undefined;
    getTotalCost: () => number;
    getCostByModel: () => Record<string, { cost: number; count: number; tokens: number }>;
}

function generateId(): string {
    return `TK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

export const useTicketStore = create<TicketState>()(
    persist(
        (set, get) => ({
            tickets: [],
            generationCosts: [],
            isProcessing: false,
            apiKey: "",
            model: "google/gemini-2.0-flash-001",

            setApiKey: (key: string) => set({ apiKey: key }),

            setModel: (model: string) => set({ model }),

            createTicketFromPrompt: async (prompt: string) => {
                const { apiKey, model } = get();

                if (!apiKey) {
                    toast.error("API Key requerida", {
                        description: "Configura tu API Key de OpenRouter para generar tickets.",
                    });
                    return null;
                }

                if (!prompt.trim()) {
                    toast.error("El prompt no puede estar vacío");
                    return null;
                }

                set({ isProcessing: true });

                try {
                    const result = await classifyTicketWithAI(prompt, apiKey, model);

                    const now = new Date().toISOString();
                    const ticketId = generateId();

                    const ticket: Ticket = {
                        id: ticketId,
                        title: result.ticket.title,
                        description: result.ticket.description,
                        type: result.ticket.type,
                        priority: result.ticket.priority,
                        status: "OPEN",
                        deadline: result.ticket.deadline,
                        estimatedHours: result.ticket.estimatedHours,
                        tags: result.ticket.tags,
                        originalPrompt: prompt,
                        createdAt: now,
                        updatedAt: now,
                    };

                    const costRecord: GenerationCost = {
                        id: `COST-${Date.now().toString(36).toUpperCase()}`,
                        ticketId,
                        model: result.cost.model,
                        usage: result.cost.usage,
                        promptCostPerMillion: result.cost.promptCostPerMillion,
                        completionCostPerMillion: result.cost.completionCostPerMillion,
                        totalCost: result.cost.totalCost,
                        createdAt: now,
                    };

                    set((state) => ({
                        tickets: [ticket, ...state.tickets],
                        generationCosts: [costRecord, ...state.generationCosts],
                        isProcessing: false,
                    }));

                    toast.success("Ticket creado exitosamente", {
                        description: `${ticket.id}: ${ticket.title}`,
                    });

                    return ticket;
                } catch (error) {
                    set({ isProcessing: false });
                    const message = error instanceof Error ? error.message : "Error desconocido";
                    toast.error("Error al crear ticket", { description: message });
                    console.error("Error creating ticket:", error);
                    return null;
                }
            },

            updateTicketStatus: (id: string, status: TicketStatus) => {
                set((state) => ({
                    tickets: state.tickets.map((t) =>
                        t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
                    ),
                }));
                toast.success("Estado del ticket actualizado");
            },

            updateTicket: (id: string, updates: Partial<Omit<Ticket, "id" | "createdAt" | "originalPrompt">>) => {
                set((state) => ({
                    tickets: state.tickets.map((t) =>
                        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
                    ),
                }));
                toast.success("Ticket actualizado");
            },

            deleteTicket: (id: string) => {
                set((state) => ({
                    tickets: state.tickets.filter((t) => t.id !== id),
                }));
                toast.success("Ticket eliminado");
            },

            getTicketById: (id: string) => {
                return get().tickets.find((t) => t.id === id);
            },

            getTotalCost: () => {
                return get().generationCosts.reduce((sum, c) => sum + c.totalCost, 0);
            },

            getCostByModel: () => {
                const costs = get().generationCosts;
                const map: Record<string, { cost: number; count: number; tokens: number }> = {};
                for (const c of costs) {
                    if (!map[c.model]) {
                        map[c.model] = { cost: 0, count: 0, tokens: 0 };
                    }
                    map[c.model].cost += c.totalCost;
                    map[c.model].count += 1;
                    map[c.model].tokens += c.usage.totalTokens;
                }
                return map;
            },
        }),
        {
            name: "ticket-store",
            partialize: (state) => ({
                tickets: state.tickets,
                generationCosts: state.generationCosts,
                apiKey: state.apiKey,
                model: state.model,
            }),
        }
    )
);
