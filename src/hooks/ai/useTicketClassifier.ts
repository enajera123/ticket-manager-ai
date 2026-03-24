import { useState } from "react"
import type { Ticket } from "@/model/Ticket"
import { classifyTicketWithAI } from "@/ai/tickets/ticketAI"
import { useOpenRouterConfigStore } from "@/store/openRouter/useOpenRouterConfig"
import { useTicketStore } from "@/store/useTicketStore"
import { useGenerationCostStore } from "@/store/useGenerationCostStore"
import { toast } from "sonner"

export function useTicketClassifier() {
  const [isProcessing, setIsProcessing] = useState(false)

  const classifyTicket = async (
    prompt: string,
    projectId: number,
    projectContext?: string
  ): Promise<Ticket | null> => {
    const { apiKey, model } = useOpenRouterConfigStore.getState()

    if (!apiKey) {
      toast.error("API Key requerida", {
        description: "Configura tu API Key de OpenRouter para generar tickets.",
      })
      return null
    }

    if (!prompt.trim()) {
      toast.error("El prompt no puede estar vacío")
      return null
    }

    setIsProcessing(true)

    try {
      const enrichedPrompt = projectContext
        ? `Contexto del proyecto: ${projectContext}\n\nPetición: ${prompt}`
        : prompt

      const { cost, data: ticket } = await classifyTicketWithAI(enrichedPrompt, apiKey, model)

      if (!ticket) {
        toast.error("Error al clasificar ticket", { description: "No se pudo generar el ticket" })
        return null
      }

      const ticketRecord: Ticket = {
        ...ticket,
        projectId,
        originalPrompt: prompt,
        status: "OPEN",
      }

      const { createTicket } = useTicketStore.getState()
      const createdTicket = await createTicket(ticketRecord)

      if (createdTicket) {
        const { createGenerationCost } = useGenerationCostStore.getState()
        await createGenerationCost(cost)
        toast.success("Ticket creado exitosamente", {
          description: `${ticketRecord.title}`,
        })
      }

      return createdTicket
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido"
      toast.error("Error al crear ticket", { description: message })
      console.error("Error creating ticket:", error)
      return null
    } finally {
      setIsProcessing(false)
    }
  }

  return { classifyTicket, isProcessing }
}