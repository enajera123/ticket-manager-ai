import supabase from "@/lib/config/supabase";
import type { Ticket } from "@/model/Ticket";
import type { PostgrestError } from "@supabase/supabase-js";

export default class TicketService {
    private static instance: TicketService | null = null;

    private constructor() { }
    public static getInstance(): TicketService {
        TicketService.instance ??= new TicketService();
        return TicketService.instance;
    }

    static async getTicketsByProject(projectId: number): Promise<{ data: Ticket[]; error: PostgrestError | null }> {
        const { data, error } = await supabase.from("Ticket").select("*").eq("projectId", projectId);
        if (error) {
            console.error("Error fetching tickets:", error);
            return { data: [], error };
        }
        return { data, error: null };
    }

    static async createTicket(ticket: Ticket): Promise<{ data: Ticket | null; error: PostgrestError | null }> {
        const { data, error } = await supabase.from("Ticket").insert(ticket).select("*").single();
        if (error) {
            console.error("Error creating ticket:", error);
            return { data: null, error };
        }
        return { data, error: null };
    }

    static async updateTicket(id: number, ticket: Ticket): Promise<{ data: Ticket | null; error: PostgrestError | null }> {
        const { data, error } = await supabase.from("Ticket").update(ticket).eq("id", id).select("*").single();
        if (error) {
            console.error("Error updating ticket:", error);
            return { data: null, error };
        }
        return { data, error: null };
    }

    static async deleteTicket(id: number): Promise<{ success: boolean; error: PostgrestError | null }> {
        const { error } = await supabase.from("Ticket").delete().eq("id", id);
        if (error) {
            console.error("Error deleting ticket:", error);
            return { success: false, error };
        }
        return { success: true, error: null };
    }
}

