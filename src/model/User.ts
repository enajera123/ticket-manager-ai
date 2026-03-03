import type { UserRole } from "./enums/UserRole";

export class User {
    id: string;
    email: string;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    role: UserRole;
    constructor(id: string, email: string, name: string, isActive: boolean, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.role = "USER";
    }
}