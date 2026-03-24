import { create } from "zustand"
import { toast } from "sonner"
import type { Ticket } from "@/model/Ticket"
import TicketService from "@/services/ticket"

interface TicketState {
  tickets: Ticket[]
  isProcessing: boolean
  createTicket: (ticket: Ticket) => Promise<Ticket | null>
  updateTicket: (id: number, ticket: Ticket) => Promise<Ticket | null>
  deleteTicket: (id: number) => Promise<void>
  getTicketsByProject: (projectId: number) => Promise<Ticket[]>
}

export const useTicketStore = create<TicketState>((set) => {
  return {
    tickets: [],
    isProcessing: false,
    createTicket: async (ticket: Ticket) => {
      const { data, error } = await TicketService.createTicket(ticket)
      if (error) {
        toast.error("Error al crear ticket", { description: error.message })
        console.error("Error creating ticket:", error)
        return null
      }
      if (data) {
        set((state) => ({
          tickets: [data, ...state.tickets],
        }))
      }
      return data
    },
    updateTicket: async (id: number, ticket: Ticket) => {
      const { data, error } = await TicketService.updateTicket(id, ticket)
      if (error) {
        toast.error("Error al actualizar ticket", { description: error.message })
        console.error("Error updating ticket:", error)
        return null
      }
      if (data) {
        set((state) => ({
          tickets: state.tickets.map((t) => (t.id === id ? data : t)),
        }))
      }
      return data
    },
    deleteTicket: async (id: number) => {
      const { error } = await TicketService.deleteTicket(id)
      if (error) {
        toast.error("Error al eliminar ticket", { description: error.message })
        console.error("Error deleting ticket:", error)
        return
      }
      set((state) => ({
        tickets: state.tickets.filter((t) => t.id !== id),
      }))
    },
    getTicketsByProject: async (projectId: number) => {
      const { data: tickets, error } = await TicketService.getTicketsByProject(projectId)
      if (error) {
        toast.error("Ocurrió un error al obtener los tickets del proyecto", {
          description: error.message,
        })
        return []
      }
      set(() => ({
        tickets: tickets || [],
      }))
      return tickets || []
    },
  }
})