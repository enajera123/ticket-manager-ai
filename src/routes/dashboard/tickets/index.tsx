'use client'

import { PageTransition } from "@/components/common/layout/PageTransition"
import { TicketPromptForm } from "@/components/dashboard/tickets/TicketPromptForm"
import { TicketList } from "@/components/dashboard/tickets/TicketList"
import { TicketStats } from "@/components/dashboard/tickets/TicketStats"

export default function TicketsPage() {
    return (
        <PageTransition>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Tickets</h2>
                        <p className="text-muted-foreground">
                            Genera y gestiona tickets de manera inteligente con IA
                        </p>
                    </div>
                </div>
                <TicketPromptForm />
                <TicketStats />
                <TicketList />
            </div>
        </PageTransition>
    )
}
