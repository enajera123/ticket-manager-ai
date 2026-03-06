import type { Ticket } from "@/model/Ticket"
import { useTicketStore } from "@/store/useTicketStore"

export function useCrudTickets() {
    const { createTicket, updateTicket } = useTicketStore()
    const handleSave = (ticket: Ticket) => {
        if (ticket?.id) {
            const { id, created_at, ...updates } = ticket
            updateTicket(id, updates)
        } else {
            createTicket(ticket)
        }
    }
    return {
        handleSave,
    }
}