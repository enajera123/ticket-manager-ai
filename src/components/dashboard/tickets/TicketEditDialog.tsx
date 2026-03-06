import { useState } from "react"
import { AppDialog } from "@/components/common/AppDialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Ticket, TicketType, TicketPriority, TicketStatus } from "@/model/Ticket"
import { ListTodo, X } from "lucide-react"
import { Form, useFormik, FormikProvider } from "formik"
import { ticketInitialValues, TicketSchema } from "@/schemas/TicketSchema"
import InputField from "@/components/common/InputField"
import SelectField from "@/components/common/SelectField"
import { useCrudTickets } from "@/hooks/tickets/useCrudTickets"
import { useProject } from "@/hooks/stores/useProject"

const ticketTypes: { value: TicketType; label: string }[] = [
    { value: "BUG", label: "Bug" },
    { value: "FEATURE", label: "Feature" },
    { value: "IMPROVEMENT", label: "Mejora" },
    { value: "TASK", label: "Tarea" },
    { value: "SUPPORT", label: "Soporte" },
]

const ticketPriorities: { value: TicketPriority; label: string }[] = [
    { value: "CRITICAL", label: "Crítica" },
    { value: "HIGH", label: "Alta" },
    { value: "MEDIUM", label: "Media" },
    { value: "LOW", label: "Baja" },
]

const ticketStatuses: { value: TicketStatus; label: string }[] = [
    { value: "OPEN", label: "Abierto" },
    { value: "IN_PROGRESS", label: "En Progreso" },
    { value: "RESOLVED", label: "Resuelto" },
    { value: "CLOSED", label: "Cerrado" },
]

interface TicketEditDialogProps {
    ticket: Ticket | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function TicketEditDialog({ ticket, open, onOpenChange }: TicketEditDialogProps) {

    const { handleSave } = useCrudTickets()
    const { currentProject } = useProject()
    const [tagInput, setTagInput] = useState("")

    const initialValues = ticket
        ? ticketInitialValues(ticket)
        : { ...ticketInitialValues(null), projectId: currentProject?.id || "" }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValues as Ticket,
        validationSchema: TicketSchema,
        onSubmit: (values) => handleSave(values),
    })
    const { values, setFieldValue } = formik

    return (
        <AppDialog
            open={open}
            onOpenChange={onOpenChange}
            title={ticket?.id ? "Editar ticket" : "Crear ticket"}
            description={ticket?.id ? `Editando: ${ticket.title}` : "Crea un nuevo ticket para tu proyecto"}
            showFooter={true}
            onCancel={() => onOpenChange(false)}
            onConfirm={() => formik.submitForm()}
            cancelText="Cancelar"
            confirmText="Guardar cambios"
            loading={false}
            maxWidth="max-w-2xl max-h-[90vh] overflow-y-auto"
        >
            <FormikProvider
                value={formik}
            >
                <Form>
                    <div className="space-y-4">
                        <InputField
                            label="Título del ticket"
                            name="title"
                            placeholder="Título del ticket"
                            tooltip="Ingrese un título para el ticket"
                            icon={<ListTodo className="h-4 w-4 text-muted-foreground" />}
                        />
                        <InputField
                            label="Descripción del ticket"
                            name="description"
                            placeholder="Descripción del ticket"
                            tooltip="Ingrese una descripción detallada del ticket"
                            multiline={true}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <SelectField
                                label="Tipo"
                                name="type"
                                options={ticketTypes}
                                placeholder="Seleccione el tipo de ticket"
                                tooltip="Seleccione el tipo que mejor describa el ticket"
                                icon={<ListTodo className="h-4 w-4 text-muted-foreground" />}
                            />
                            <SelectField
                                label="Prioridad"
                                name="priority"
                                options={ticketPriorities}
                                placeholder="Seleccione la prioridad"
                                tooltip="Seleccione la prioridad del ticket"
                                icon={<ListTodo className="h-4 w-4 text-muted-foreground" />}
                            />
                        </div>
                        <SelectField
                            label="Estado"
                            name="status"
                            options={ticketStatuses}
                            placeholder="Seleccione el estado"
                            tooltip="Seleccione el estado actual del ticket"
                            icon={<ListTodo className="h-4 w-4 text-muted-foreground" />}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                type="date"
                                name="deadline"
                                label="Fecha límite"
                                tooltip="Seleccione la fecha límite para resolver el ticket"
                            />
                            <InputField
                                type="number"
                                name="estimatedHours"
                                label="Horas estimadas"
                                tooltip="Ingrese el número estimado de horas para resolver el ticket"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="edit-tag-input" className="text-sm font-medium">Tags</label>
                            <div className="flex flex-wrap gap-1 my-2">
                                {values.tags?.map((tag: string) => (
                                    <Badge key={tag} variant="info" className="gap-1 pr-1">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => setFieldValue('tags', values.tags.filter((t: string) => t !== tag))}
                                            className="ml-0.5 rounded-full hover:bg-muted p-0.5"
                                        >
                                            <X className="h-2.5 w-2.5" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    id="edit-tag-input"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    placeholder="Agregar tag..."
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault()
                                            const trimmed = tagInput.trim()
                                            if (trimmed && !values.tags.includes(trimmed)) {
                                                setFieldValue('tags', [...(values.tags || []), trimmed])
                                                setTagInput("")
                                            }
                                        }
                                    }}
                                />
                                <Button type="button" variant="outline" size="sm" onClick={() => {
                                    const trimmed = tagInput.trim()
                                    if (trimmed && !values.tags.includes(trimmed)) {
                                        setFieldValue('tags', [...(values.tags || []), trimmed])
                                        setTagInput("")
                                    }
                                }}>
                                    Agregar
                                </Button>
                            </div>
                        </div>
                        <InputField
                            name="originalPrompt"
                            label="Prompt original"
                            tooltip="El prompt original que se usó para generar este ticket (solo lectura)"
                            multiline={true}
                            readOnly
                            disabled
                            className="italic"
                        />
                    </div>
                </Form>
            </FormikProvider>
        </AppDialog>
    )
}
