'use client'

import { Formik, Form } from "formik"
import * as Yup from "yup"
import { AppDialog } from "@/components/common/AppDialog"
import InputField from "@/components/common/InputField"
import { useProjectStore } from "@/store/useProjectStore"
import type { Project } from "@/model/Project"
import { FolderOpen, Palette } from "lucide-react"

const ProjectSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es requerido"),
    description: Yup.string().required("La descripción es requerida"),
    context: Yup.string().required("El contexto es requerido"),
    color: Yup.string().required("El color es requerido"),
})

const COLORS = [
    "#ef4444", "#f97316", "#f59e0b", "#eab308", 
    "#84cc16", "#22c55e", "#10b981", "#14b8a6",
    "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
    "#8b5cf6", "#a855f7", "#d946ef", "#ec4899",
]

interface ProjectFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    project?: Project | null
}

export function ProjectFormDialog({ open, onOpenChange, project }: ProjectFormDialogProps) {
    const { createProject, updateProject } = useProjectStore()
    const isEdit = !!project

    return (
        <AppDialog
            open={open}
            onOpenChange={onOpenChange}
            title={isEdit ? "Editar Proyecto" : "Nuevo Proyecto"}
            description={isEdit ? project.id : "Crea un nuevo proyecto para organizar tus tickets"}
            maxWidth="max-w-2xl"
        >
            <Formik
                initialValues={{
                    name: project?.name || "",
                    description: project?.description || "",
                    context: project?.context || "",
                    color: project?.color || COLORS[0],
                }}
                validationSchema={ProjectSchema}
                onSubmit={(values) => {
                    if (isEdit && project) {
                        updateProject(project.id, values)
                    } else {
                        createProject(values)
                    }
                    onOpenChange(false)
                }}
            >
                {({ values, setFieldValue }) => (
                    <Form className="space-y-4">
                        <InputField
                            name="name"
                            label="Nombre del Proyecto"
                            placeholder="Ej: Sistema de Gestión"
                            tooltip="Nombre identificativo del proyecto"
                            icon={<FolderOpen />}
                        />

                        <InputField
                            name="description"
                            label="Descripción"
                            placeholder="Breve descripción del proyecto"
                            tooltip="Descripción corta del proyecto"
                            multiline
                        />

                        <InputField
                            name="context"
                            label="Contexto del Proyecto"
                            placeholder="Stack tecnológico, arquitectura, convenciones..."
                            tooltip="Este contexto se usará para mejorar la generación de tickets con IA"
                            multiline
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Palette className="h-4 w-4" />
                                Color
                            </label>
                            <div className="grid grid-cols-8 gap-2">
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setFieldValue("color", color)}
                                        className={`w-10 h-10 rounded-md transition-transform hover:scale-110 ${
                                            values.color === color ? "ring-2 ring-offset-2 ring-foreground scale-110" : ""
                                        }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <button
                                type="button"
                                onClick={() => onOpenChange(false)}
                                className="px-4 py-2 text-sm rounded-md hover:bg-muted"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                            >
                                {isEdit ? "Actualizar" : "Crear"} Proyecto
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </AppDialog>
    )
}
