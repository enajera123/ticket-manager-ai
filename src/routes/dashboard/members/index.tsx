'use client'

import { PageTransition } from "@/components/common/layout/PageTransition"
import { MemberList } from "@/components/dashboard/members/MemberList"

export default function MembersPage() {
    return (
        <PageTransition>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Miembros</h2>
                        <p className="text-muted-foreground">
                            Gestiona los miembros de tu proyecto
                        </p>
                    </div>
                </div>
                <MemberList />
            </div>
        </PageTransition>
    )
}
