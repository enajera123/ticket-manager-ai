import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectCard } from "./ProjectCard"
import { ProjectFormDialog } from "./ProjectFormDialog"
import type { Project } from "@/model/Project"
import { useProject } from "@/hooks/stores/useProject"

export function ProjectList() {
    const { projects } = useProject()
    const [editingProject, setEditingProject] = useState<Project | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleEdit = (project: Project) => {
        setEditingProject(project)
        setDialogOpen(true)
    }

    const handleNewProject = () => {
        setEditingProject(null)
        setDialogOpen(true)
    }

    const handleCloseDialog = (open: boolean) => {
        setDialogOpen(open)
        if (!open) {
            setEditingProject(null)
        }
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Proyectos</h3>
                    <Button onClick={handleNewProject} size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Nuevo Proyecto
                    </Button>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No hay proyectos creados</p>
                        <p className="text-sm">Crea tu primer proyecto para comenzar</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                            {(projects as Required<Project>[]).map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onEdit={handleEdit}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <ProjectFormDialog
                open={dialogOpen}
                onOpenChange={handleCloseDialog}
                project={editingProject}
            />
        </>
    )
}
