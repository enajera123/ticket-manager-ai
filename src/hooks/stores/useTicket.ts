import { useTicketStore } from "@/store/useTicketStore"
import { useEffect } from "react"
import { useProjectStore } from "@/store/useProjectStore"

/**
 * Hook for ticket operations with auto-loading by current project.
 * Automatically fetches tickets when the current project changes.
 */
export function useTicket() {
  const tickets = useTicketStore((s) => s.tickets)
  const isProcessing = useTicketStore((s) => s.isProcessing)
  const getTicketsByProject = useTicketStore((s) => s.getTicketsByProject)
  const currentProject = useProjectStore((s) => s.currentProject)

  useEffect(() => {
    if (currentProject?.id) {
      getTicketsByProject(currentProject.id)
    }
  }, [currentProject?.id, getTicketsByProject])

  const createTicket = useTicketStore((s) => s.createTicket)
  const updateTicket = useTicketStore((s) => s.updateTicket)
  const deleteTicket = useTicketStore((s) => s.deleteTicket)

  return {
    tickets,
    isProcessing,
    createTicket,
    updateTicket,
    deleteTicket,
  }
}
