import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import type { Project } from "@/model/Project"
import { useProject } from "@/hooks/stores/useProject"

export function ProjectSelector() {
    const { projects, currentProject, setCurrentProject } = useProject()
    const navigate = useNavigate()

    if (projects.length === 0) {
        return (
            <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/dashboard/projects")}
                className="gap-2"
            >
                <Plus className="h-4 w-4" />
                Crear Proyecto
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 min-w-50 justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                        {currentProject && (
                            <div
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: currentProject.color }}
                            />
                        )}
                        <span className="truncate">
                            {currentProject?.name || "Seleccionar proyecto"}
                        </span>
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-62.5">
                <DropdownMenuLabel>Proyectos</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(projects as Required<Project>[]).map((project) => (
                    <DropdownMenuItem
                        key={project.id}
                        onClick={() => setCurrentProject(project)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: project.color }}
                        />
                        <span className="flex-1 truncate">{project.name}</span>
                        {currentProject?.id === project.id && (
                            <Check className="h-4 w-4 shrink-0" />
                        )}
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => navigate("/dashboard/projects")}
                    className="cursor-pointer"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Gestionar proyectos
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
