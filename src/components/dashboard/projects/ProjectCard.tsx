import { motion } from "framer-motion"
import { Pencil, Trash2, Users, ListTodo } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useMemberStore } from "@/store/useMemberStore"
import type { Project } from "@/model/Project"
import { useProject } from "@/hooks/stores/useProject"
import { showConfirmationAlert } from "@/lib/utils/alert"
import { useTicket } from "@/hooks/stores/useTicket"

interface ProjectCardProps {
    project: Required<Project>
    onEdit: (project: Project) => void
}

export function ProjectCard({ project, onEdit }: ProjectCardProps) {
    const { deleteProject, setCurrentProject, currentProject } = useProject()
    const { tickets } = useTicket()
    const { members } = useMemberStore()

    const projectTickets = tickets.filter((t) => t.projectId === project.id)
    const projectMembers = members.filter((m) => m.projectId === project.id)
    const isActive = currentProject?.id === project.id

    const handleDelete = async () => {
        const result = await showConfirmationAlert("¿Eliminar proyecto?", `Se eliminarán ${projectTickets.length} tickets y ${projectMembers.length} miembros asociados.`)
        if (!result.isConfirmed) return
        deleteProject(project.id)
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
        >
            <Card
                className={`hover:shadow-md transition-all cursor-pointer border-l-4 ${isActive ? "ring-2 bg-muted/50" : ""
                    }`}
                style={{
                    borderLeftColor: project.color,
                    ...(isActive && { '--tw-ring-color': project.color } as React.CSSProperties)
                }}
                onClick={() => setCurrentProject(project)}
            >
                <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <CardTitle className="text-base font-semibold truncate">
                                {project.name}
                            </CardTitle>
                        </div>
                        {isActive && (
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                                Activo
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{project.id}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <ListTodo className="h-3 w-3" />
                            {projectTickets.length} tickets
                        </span>
                        <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {projectMembers.length} miembros
                        </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation()
                                onEdit(project)
                            }}
                            className="text-xs h-7"
                        >
                            <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDelete()
                            }}
                            className="text-xs h-7 text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
