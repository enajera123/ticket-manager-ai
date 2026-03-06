import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import type { Member } from "@/model/Member";
import { generateId } from "@/lib/utils/random";

interface MemberState {
    members: Member[];
    createMember: (member: Omit<Member, "id" | "addedAt">) => void;
    updateMember: (id: string, updates: Partial<Omit<Member, "id" | "projectId" | "addedAt">>) => void;
    deleteMember: (id: string) => void;
    getMemberById: (id: string) => Member | undefined;
    getMembersByProject: (projectId: string) => Member[];
}

export const useMemberStore = create<MemberState>()(
    persist(
        (set, get) => ({
            members: [],
            
            createMember: (memberData) => {
                const member: Member = {
                    ...memberData,
                    id: generateId("MBR"),
                    addedAt: new Date().toISOString(),
                };
                
                set((state) => ({
                    members: [member, ...state.members],
                }));
                
                toast.success("Miembro agregado", {
                    description: `${member.name} - ${member.role}`,
                });
            },
            
            updateMember: (id, updates) => {
                set((state) => ({
                    members: state.members.map((m) =>
                        m.id === id ? { ...m, ...updates } : m
                    ),
                }));
                
                toast.success("Miembro actualizado");
            },
            
            deleteMember: (id) => {
                set((state) => ({
                    members: state.members.filter((m) => m.id !== id),
                }));
                
                toast.success("Miembro eliminado");
            },
            
            getMemberById: (id) => {
                return get().members.find((m) => m.id === id);
            },
            
            getMembersByProject: (projectId) => {
                return get().members.filter((m) => m.projectId === projectId);
            },
        }),
        {
            name: "member-storage",
        }
    )
);
