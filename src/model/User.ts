import type { UserRole } from "./enums/UserRole";

export class User {
    id: string;
    email: string;
    name: string;
    isActive: boolean;
    role: UserRole;
    constructor(id: string, email: string, name: string, isActive: boolean) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.isActive = isActive;
        this.role = "USER";
    }
}