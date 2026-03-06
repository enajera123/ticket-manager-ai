import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMemberStore } from "@/store/useMemberStore"
import { MemberCard } from "./MemberCard"
import { MemberFormDialog } from "./MemberFormDialog"
import type { Member } from "@/model/Member"
import { useProject } from "@/hooks/stores/useProject"

export function MemberList() {
    const { members } = useMemberStore()
    const { currentProject } = useProject()
    const [editingMember, setEditingMember] = useState<Member | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const projectMembers = currentProject
        ? members.filter((m) => m.projectId === currentProject.id)
        : []

    const handleEdit = (member: Member) => {
        setEditingMember(member)
        setDialogOpen(true)
    }

    const handleNewMember = () => {
        setEditingMember(null)
        setDialogOpen(true)
    }

    const handleCloseDialog = (open: boolean) => {
        setDialogOpen(open)
        if (!open) {
            setEditingMember(null)
        }
    }

    if (!currentProject) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>Selecciona un proyecto para ver sus miembros</p>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                        Miembros de {currentProject.name}
                    </h3>
                    <Button onClick={handleNewMember} size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar Miembro
                    </Button>
                </div>

                {projectMembers.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No hay miembros en este proyecto</p>
                        <p className="text-sm">Agrega miembros para colaborar</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {projectMembers.map((member) => (
                            <MemberCard
                                key={member.id}
                                member={member}
                                onEdit={handleEdit}
                            />
                        ))}
                    </div>
                )}
            </div>

            {currentProject && (
                <MemberFormDialog
                    open={dialogOpen}
                    onOpenChange={handleCloseDialog}
                    projectId={currentProject?.id || 0}
                    member={editingMember}
                />
            )}
        </>
    )
}
