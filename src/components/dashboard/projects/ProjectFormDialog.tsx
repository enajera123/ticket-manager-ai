import { Form, useFormik, FormikProvider } from "formik"
import { AppDialog } from "@/components/common/AppDialog"
import InputField from "@/components/common/InputField"
import type { Project } from "@/model/Project"
import { FolderOpen } from "lucide-react"
import { useProject } from "@/hooks/stores/useProject"
import { ColorSelector } from "@/components/common/ColorSelector"
import { projectInitialValues, ProjectSchema } from "@/schemas/ProjectSchema"
interface ProjectFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    project: Project | null
}

export function ProjectFormDialog({ open, onOpenChange, project }: ProjectFormDialogProps) {
    const { createProject, updateProject } = useProject()
    const initialValues = projectInitialValues(project)
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValues as Project,
        validationSchema: ProjectSchema,
        onSubmit: (values) => handleSubmit(values)
    })
    const { values, setFieldValue } = formik
    const handleSubmit = (values: Project) => {
        if (project?.id) {
            updateProject(project.id, values)
        } else {
            createProject(values)
        }
        onOpenChange(false)
    }
    return (
        <AppDialog
            open={open}
            onOpenChange={onOpenChange}
            onConfirm={() => formik.submitForm()}
            onCancel={() => onOpenChange(false)}
            title={project?.id ? "Editar Proyecto" : "Nuevo Proyecto"}
            description={project?.id ? `Editando: ${project.name}` : "Crea un nuevo proyecto para organizar tus tickets"}
            maxWidth="max-w-2xl"
        >
            <FormikProvider
                value={formik}
            >
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
                    <ColorSelector
                        value={values.color}
                        onChange={(color) => setFieldValue("color", color)}
                    />
                </Form>
            </FormikProvider>
        </AppDialog>
    )
}
