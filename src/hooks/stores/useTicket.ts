import { useTicketStore } from "@/store/useTicketStore"
import { useEffect } from "react"
import { useProject } from "./useProject"

export function useTicket() {
    const store = useTicketStore()
    const loadTicketsByProject = useTicketStore((s) => s.getTicketsByProject)
    const { currentProject } = useProject()
    useEffect(() => {
        loadTicketsByProject(currentProject?.id || -1)
    }, [loadTicketsByProject, currentProject])

    return {
        ...store,
    }
}