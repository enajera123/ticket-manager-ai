import type { Ticket } from "@/model/Ticket"
import { useTicket } from "../stores/useTicket"

export function useCrudTickets() {
    const { createTicket, updateTicket } = useTicket()
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