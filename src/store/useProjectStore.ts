import { create } from "zustand";
import { toast } from "sonner";
import type { Project } from "@/model/Project";
import ProjectService from "@/services/project";
import { persist } from "zustand/middleware";

interface ProjectState {
    projects: Project[];
    currentProject: Project | null;
    createProject: (project: Project) => Promise<Project | null>;
    updateProject: (id: number, project: Project) => Promise<Project | null>;
    deleteProject: (id: number) => Promise<void>;
    setCurrentProject: (project: Project) => void;
    getProjects: () => Promise<void>;
}

export const useProjectStore = create<ProjectState>()(
    persist((set) => ({
        projects: [],
        currentProject: null,
        createProject: async (project) => {
            const { data, error } = await ProjectService.createProject(project);
            if (!data) {
                toast.error("Error al crear el proyecto", {
                    description: error?.message || "Ocurrió un error desconocido",
                });
                return null;
            }
            set((state) => ({
                projects: [data, ...state.projects],
            }));

            return data;
        },
        getProjects: async () => {
            const { data, error } = await ProjectService.getProjects();
            if (!data) {
                toast.error("Error al obtener los proyectos", {
                    description: error?.message || "Ocurrió un error desconocido",
                });
                return;
            }
            set({ projects: data });
        },
        updateProject: async (id, project) => {
            const { data, error } = await ProjectService.updateProject(id, project);
            if (!data) {
                toast.error("Error al actualizar el proyecto", {
                    description: error?.message || "Ocurrió un error desconocido",
                });
                return null;
            }
            set((state) => ({
                projects: state.projects.map((p) => (p.id === id ? data : p)),
                currentProject: state.currentProject?.id === id ? data : state.currentProject,
            }));
            return data;
        },

        deleteProject: async (id) => {
            const { error } = await ProjectService.deleteProject(id);
            if (error) {
                toast.error("Error al eliminar el proyecto", {
                    description: error.message || "Ocurrió un error desconocido",
                });
                return;
            }
            set((state) => ({
                projects: state.projects.filter((p) => p.id !== id),
                currentProject: state.currentProject?.id === id ? null : state.currentProject,
            }));

            toast.success("Proyecto eliminado");
        },

        setCurrentProject: (project) => {
            set({ currentProject: project });
        }
    }),
        {
            name: "project-storage",
            partialize: (state) => ({
                currentProject: state.currentProject,
            }),
        }
    )
);
