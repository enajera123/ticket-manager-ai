import type { Ticket } from "@/model/Ticket"
import { useTicketStore } from "@/store/useTicketStore"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ListTodo } from "lucide-react"
import { TicketCard } from "./TicketCard"
import { TicketEditDialog } from "./TicketEditDialog"

export function TicketList() {
    const { tickets } = useTicketStore()
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null)
    const [editDialogOpen, setEditDialogOpen] = useState(false)

    const handleEdit = (ticket: Ticket) => {
        setEditingTicket(ticket)
        setEditDialogOpen(true)
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
                    No hay tickets aún
                </h3>
                <p className="text-sm text-muted-foreground/70 mt-1">
                    Escribe un prompt arriba para generar tu primer ticket con IA
                </p>
            </motion.div>
        )
    }

    return (
        <>
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
