import type { Project } from "@/model/Project";
import * as Yup from "yup";
export const ProjectSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es requerido"),
    description: Yup.string().required("La descripción es requerida"),
    color: Yup.string().required("El color es requerido"),
})

export const projectInitialValues = (project: Project | null) => {

    return {
        id: project?.id,
        name: project?.name || "",
        description: project?.description || "",
        context: project?.context || "",
        color: project?.color || "#ef4444",
    } as Partial<Project>
};