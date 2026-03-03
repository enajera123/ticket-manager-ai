import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import type { Ticket, TicketStatus } from "@/model/Ticket";
import { classifyTicketWithAI } from "@/ai/openrouter";

interface TicketState {
    tickets: Ticket[];
    isProcessing: boolean;
    apiKey: string;
    model: string;
    setApiKey: (key: string) => void;
    setModel: (model: string) => void;
    createTicketFromPrompt: (prompt: string) => Promise<Ticket | null>;
    updateTicketStatus: (id: string, status: TicketStatus) => void;
    deleteTicket: (id: string) => void;
    getTicketById: (id: string) => Ticket | undefined;
}

function generateId(): string {
    return `TK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

export const useTicketStore = create<TicketState>()(
    persist(
        (set, get) => ({
            tickets: [],
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
                    const aiResponse = await classifyTicketWithAI(prompt, apiKey, model);

                    const now = new Date().toISOString();
                    const ticket: Ticket = {
                        id: generateId(),
                        title: aiResponse.title,
                        description: aiResponse.description,
                        type: aiResponse.type,
                        priority: aiResponse.priority,
                        status: "OPEN",
                        deadline: aiResponse.deadline,
                        estimatedHours: aiResponse.estimatedHours,
                        tags: aiResponse.tags,
                        originalPrompt: prompt,
                        createdAt: now,
                        updatedAt: now,
                    };

                    set((state) => ({
                        tickets: [ticket, ...state.tickets],
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

            deleteTicket: (id: string) => {
                set((state) => ({
                    tickets: state.tickets.filter((t) => t.id !== id),
                }));
                toast.success("Ticket eliminado");
            },

            getTicketById: (id: string) => {
                return get().tickets.find((t) => t.id === id);
            },
        }),
        {
            name: "ticket-store",
            partialize: (state) => ({
                tickets: state.tickets,
                apiKey: state.apiKey,
                model: state.model,
            }),
        }
    )
);
