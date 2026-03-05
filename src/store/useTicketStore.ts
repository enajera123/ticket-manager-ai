import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import type { Ticket, GenerationCost } from "@/model/Ticket";
import { generateId } from "@/lib/random";
import { classifyTicketWithAI } from "@/ai/tickets/ticketAI";
import { useOpenRouterConfigStore } from "./openRouter/useOpenRouterConfig";

interface TicketState {
    tickets: Ticket[];
    generationCosts: GenerationCost[];
    isProcessing: boolean;
    createTicketFromPrompt: (prompt: string, projectId: string, projectContext?: string) => Promise<Ticket | null>;
    createTicket: (ticket: Ticket) => void;
    updateTicket: (id: string, updates: Partial<Omit<Ticket, "id" | "createdAt">>) => void;
    deleteTicket: (id: string) => void;
    getTicketById: (id: string) => Ticket | undefined;
    getTicketsByProject: (projectId: string) => Ticket[];
    getTotalCost: () => number;
    getCostByModel: () => Record<string, { cost: number; count: number; tokens: number }>;
}



export const useTicketStore = create<TicketState>()(
    persist(
        (set, get) => ({
            tickets: [],
            generationCosts: [],
            isProcessing: false,
            apiKey: "",
            model: "",
            createTicketFromPrompt: async (prompt: string, projectId: string, projectContext?: string) => {
                const { apiKey, model } = useOpenRouterConfigStore.getState();
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
                    // Add project context to the prompt if available
                    const enrichedPrompt = projectContext 
                        ? `Contexto del proyecto: ${projectContext}\n\nPetición: ${prompt}`
                        : prompt;
                    
                    const { cost, data: ticket } = await classifyTicketWithAI(enrichedPrompt, apiKey, model);
                    const now = new Date().toISOString();
                    const ticketRecord: Ticket = {
                        ...ticket,
                        id: generateId("TK"),
                        projectId,
                        originalPrompt: prompt,
                        status: "OPEN",
                        createdAt: now,
                        updatedAt: now,
                    }
                    const costRecord: GenerationCost = {
                        ...cost,
                        id: generateId("COST"),
                        createdAt: now,
                    };
                    set((state) => ({
                        tickets: [ticketRecord, ...state.tickets],
                        generationCosts: [costRecord, ...state.generationCosts],
                        isProcessing: false,
                    }));
                    toast.success("Ticket creado exitosamente", {
                        description: `${ticketRecord.id}: ${ticketRecord.title}`,
                    });
                    return ticketRecord;
                } catch (error) {
                    set({ isProcessing: false });
                    const message = error instanceof Error ? error.message : "Error desconocido";
                    toast.error("Error al crear ticket", { description: message });
                    console.error("Error creating ticket:", error);
                    return null;
                }
            },
            createTicket: (ticket: Ticket) => {
                set((state) => ({
                    tickets: [{
                        ...ticket,
                        id: generateId("TK"),
                    }, ...state.tickets],
                }));
                toast.success("Ticket guardado");
            },
            updateTicket: (id: string, updates: Partial<Omit<Ticket, "id" | "createdAt">>) => {
                set((state) => ({
                    tickets: state.tickets.map((t) =>
                        t.id === id 
                            ? { ...t, ...updates, updatedAt: new Date().toISOString() }
                            : t
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

            getTicketsByProject: (projectId: string) => {
                return get().tickets.filter((t) => t.projectId === projectId);
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
            }),
        }
    )
);
