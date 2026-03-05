export type MemberRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

export interface Member {
    id: string;
    projectId: string;
    name: string;
    email: string;
    role: MemberRole;
    avatar?: string; // URL o iniciales
    addedAt: string;
}
