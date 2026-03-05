'use client'

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
import { useProjectStore } from "@/store/useProjectStore"
import { useNavigate } from "react-router-dom"

export function ProjectSelector() {
    const { projects, currentProjectId, setCurrentProject, getCurrentProject } = useProjectStore()
    const navigate = useNavigate()
    const currentProject = getCurrentProject()

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
                <Button variant="outline" size="sm" className="gap-2 min-w-[200px] justify-between">
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
            <DropdownMenuContent align="start" className="w-[250px]">
                <DropdownMenuLabel>Proyectos</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {projects.map((project) => (
                    <DropdownMenuItem
                        key={project.id}
                        onClick={() => setCurrentProject(project.id)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: project.color }}
                        />
                        <span className="flex-1 truncate">{project.name}</span>
                        {currentProjectId === project.id && (
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
