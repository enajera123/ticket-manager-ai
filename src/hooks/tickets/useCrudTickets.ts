import type { Ticket } from "@/model/Ticket"
import { useTicketStore } from "@/store/useTicketStore"

/**
 * Hook for common ticket CRUD operations.
 * Provides a unified save function that handles both create and update.
 */
export function useCrudTickets() {
  const createTicket = useTicketStore((s) => s.createTicket)
  const updateTicket = useTicketStore((s) => s.updateTicket)

  const handleSave = (ticket: Ticket): Promise<Ticket | null> => {
    if (ticket?.id) {
      const { id, created_at, ...updates } = ticket
      return updateTicket(id, updates)
    }
    return createTicket(ticket)
  }

  return {
    handleSave,
  }
}
