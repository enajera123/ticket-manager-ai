export interface Project {
    id: string;
    name: string;
    description: string;
    context: string; // Contexto del proyecto para generación de tickets con IA
    color: string; // Color para identificar visualmente el proyecto
    createdAt: string;
    updatedAt: string;
}
