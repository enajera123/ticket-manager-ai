import supabase from "@/lib/config/supabase";
import type { Project } from "@/model/Project";
import type { PostgrestError } from "@supabase/supabase-js";

export default class ProjectService {
    private static instance: ProjectService | null = null;

    private constructor() { }
    public static getInstance(): ProjectService {
        ProjectService.instance ??= new ProjectService();
        return ProjectService.instance;
    }

    static async getProjects(): Promise<{ data: Project[]; error: PostgrestError | null }> {
        const { data, error } = await supabase.from("Project").select("*");
        if (error) {
            console.error("Error fetching projects:", error);
            return { data: [], error };
        }
        return { data, error: null };
    }

    static async createProject(project: Project): Promise<{ data: Project | null; error: PostgrestError | null }> {
        const { data, error } = await supabase.from("Project").insert(project).select("*").single();
        if (error) {
            console.error("Error creating project:", error);
            return { data: null, error };
        }
        return { data, error: null };
    }

    static async updateProject(id: number, project: Project): Promise<{ data: Project | null; error: PostgrestError | null }> {
        const { data, error } = await supabase.from("Project").update(project).eq("id", id).select("*").single();
        if (error) {
            console.error("Error updating project:", error);
            return { data: null, error };
        }
        return { data, error: null };
    }

    static async deleteProject(id: number): Promise<{ success: boolean; error: PostgrestError | null }> {
        const { error } = await supabase.from("Project").delete().eq("id", id);
        if (error) {
            console.error("Error deleting project:", error);
            return { success: false, error };
        }
        return { success: true, error: null };
    }
}

