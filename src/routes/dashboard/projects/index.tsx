'use client'

import { PageTransition } from "@/components/common/layout/PageTransition"
import { ProjectList } from "@/components/dashboard/projects/ProjectList"

export default function ProjectsPage() {
    return (
        <PageTransition>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Proyectos</h2>
                        <p className="text-muted-foreground">
                            Organiza tus tickets por proyectos
                        </p>
                    </div>
                </div>
                <ProjectList />
            </div>
        </PageTransition>
    )
}
