import type { Ticket } from "@/model/Ticket"
import { useTicketStore } from "@/store/useTicketStore"
import { useProjectStore } from "@/store/useProjectStore"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ListTodo, Plus } from "lucide-react"
import { TicketCard } from "./TicketCard"
import { TicketEditDialog } from "./TicketEditDialog"
import { Button } from "@/components/ui/button"

export function TicketList() {
    const { getTicketsByProject } = useTicketStore()
    const { getCurrentProject } = useProjectStore()
    const currentProject = getCurrentProject()
    const tickets = currentProject ? getTicketsByProject(currentProject.id) : []
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null)
    const [editDialogOpen, setEditDialogOpen] = useState(false)

    const handleEdit = (ticket: Ticket | null) => {
        setEditingTicket(ticket)
        setEditDialogOpen(true)
    }

    if (!currentProject) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
            >
                <ListTodo className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">
                    Selecciona un proyecto
                </h3>
                <p className="text-sm text-muted-foreground/70 mt-1">
                    Elige un proyecto para ver sus tickets
                </p>
            </motion.div>
        )
    }

    if (tickets.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
            >
                <ListTodo className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">
                    No hay tickets en {currentProject.name}
                </h3>
                <p className="text-sm text-muted-foreground/70 mt-1">
                    Escribe un prompt arriba para generar tu primer ticket con IA
                </p>
            </motion.div>
        )
    }

    return (
        <>
            <div className="flex justify-end mb-4">
                <Button
                    variant="default"
                    size="sm"
                    className="w-full md:w-auto"
                    onClick={() => handleEdit(null)}
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Crear Ticket
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                    {tickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} onEdit={handleEdit} />
                    ))}
                </AnimatePresence>
            </div>
            <TicketEditDialog
                ticket={editingTicket}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
            />
        </>
    )
}
