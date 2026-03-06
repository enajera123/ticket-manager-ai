import { create } from "zustand";
import { toast } from "sonner";
import type { Ticket } from "@/model/Ticket";
import { classifyTicketWithAI } from "@/ai/tickets/ticketAI";
import { useOpenRouterConfigStore } from "./openRouter/useOpenRouterConfig";
import TicketService from "@/services/ticket";
import { useGenerationCostStore } from "./useGenerationCostStore";
interface TicketState {
    tickets: Ticket[];
    isProcessing: boolean;
    createTicketFromPrompt: (prompt: string, projectId: number, projectContext?: string) => Promise<Ticket | null>;
    createTicket: (ticket: Ticket) => Promise<Ticket | null>;
    updateTicket: (id: number, ticket: Ticket) => Promise<Ticket | null>;
    deleteTicket: (id: number) => Promise<void>;
    getTicketsByProject: (projectId: number) => Promise<Ticket[]>;
}

export const useTicketStore = create<TicketState>((set, get) => {
    return {
        tickets: [],
        isProcessing: false,
        apiKey: "",
        model: "",
        createTicketFromPrompt: async (prompt: string, projectId: number, projectContext?: string) => {
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
                const enrichedPrompt = projectContext
                    ? `Contexto del proyecto: ${projectContext}\n\nPetición: ${prompt}`
                    : prompt;

                const { cost, data: ticket } = await classifyTicketWithAI(enrichedPrompt, apiKey, model);
                const ticketRecord: Ticket = {
                    ...ticket,
                    projectId,
                    originalPrompt: prompt,
                    status: "OPEN",
                }
                const { data: ticketData, error } = await TicketService.createTicket({
                    ...ticketRecord,
                });
                useGenerationCostStore.getState().createGenerationCost(cost);
                if (!ticketData) {
                    set({ isProcessing: false });
                    toast.error("Error al crear ticket", { description: error?.message });
                    console.error("Error creating ticket:", error);
                    return null;
                }
                set((state) => ({
                    tickets: [ticketData, ...state.tickets],
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
        createTicket: async (ticket: Ticket) => {
            const { data, error } = await TicketService.createTicket(ticket);
            if (error) {
                toast.error("Error al crear ticket", { description: error.message });
                console.error("Error creating ticket:", error);
                return null;
            }
            return data;
        },
        updateTicket: async (id: number, ticket: Ticket) => {
            const { data, error } = await TicketService.updateTicket(id, ticket);
            if (error) {
                toast.error("Error al actualizar ticket", { description: error.message });
                console.error("Error updating ticket:", error);
                return null;
            }
            return data;
        },
        deleteTicket: async (id: number) => {
            const { error } = await TicketService.deleteTicket(id);
            if (error) {
                toast.error("Error al eliminar ticket", { description: error.message });
                console.error("Error deleting ticket:", error);
            }
        },
        getTicketsByProject: async (projectId: number) => {
            const { data: tickets, error } = await TicketService.getTicketsByProject(projectId);
            if (error) {
                toast.error("Ocurrió un error al obtener los tickets del proyecto", {
                    description: error.message,
                });
                return [];
            }
            set(() => ({
                tickets,
            }));
            return tickets;
        },

    }
})
