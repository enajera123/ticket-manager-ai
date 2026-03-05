import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import type { Project } from "@/model/Project";
import { generateId } from "@/lib/random";

interface ProjectState {
    projects: Project[];
    currentProjectId: string | null;
    createProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void;
    updateProject: (id: string, updates: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>) => void;
    deleteProject: (id: string) => void;
    getProjectById: (id: string) => Project | undefined;
    setCurrentProject: (id: string | null) => void;
    getCurrentProject: () => Project | undefined;
}

export const useProjectStore = create<ProjectState>()(
    persist(
        (set, get) => ({
            projects: [],
            currentProjectId: null,
            
            createProject: (projectData) => {
                const now = new Date().toISOString();
                const project: Project = {
                    ...projectData,
                    id: generateId("PRJ"),
                    createdAt: now,
                    updatedAt: now,
                };
                
                set((state) => ({
                    projects: [project, ...state.projects],
                    currentProjectId: state.currentProjectId || project.id, // Auto-select first project
                }));
                
                toast.success("Proyecto creado", {
                    description: `${project.name}`,
                });
            },
            
            updateProject: (id, updates) => {
                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === id
                            ? { ...p, ...updates, updatedAt: new Date().toISOString() }
                            : p
                    ),
                }));
                
                toast.success("Proyecto actualizado");
            },
            
            deleteProject: (id) => {
                set((state) => ({
                    projects: state.projects.filter((p) => p.id !== id),
                    currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
                }));
                
                toast.success("Proyecto eliminado");
            },
            
            getProjectById: (id) => {
                return get().projects.find((p) => p.id === id);
            },
            
            setCurrentProject: (id) => {
                set({ currentProjectId: id });
            },
            
            getCurrentProject: () => {
                const { projects, currentProjectId } = get();
                return projects.find((p) => p.id === currentProjectId);
            },
        }),
        {
            name: "project-storage",
        }
    )
);
