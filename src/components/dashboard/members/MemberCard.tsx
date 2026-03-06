import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useMemberStore } from "@/store/useMemberStore"
import type { Member, MemberRole } from "@/model/Member"
import { Pencil, Trash2, Mail } from "lucide-react"
import swal from "sweetalert2"

const ROLE_CONFIG: Record<MemberRole, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    OWNER: { label: "Propietario", variant: "destructive" },
    ADMIN: { label: "Admin", variant: "default" },
    MEMBER: { label: "Miembro", variant: "secondary" },
    VIEWER: { label: "Observador", variant: "outline" },
}

interface MemberCardProps {
    member: Member
    onEdit: (member: Member) => void
}

export function MemberCard({ member, onEdit }: MemberCardProps) {
    const { deleteMember } = useMemberStore()
    const roleConfig = ROLE_CONFIG[member.role]

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const handleDelete = () => {
        swal.fire({
            title: "¿Eliminar miembro?",
            text: `${member.name} será removido del proyecto.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMember(member.id)
            }
        })
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold truncate">{member.name}</h4>
                            <Badge variant={roleConfig.variant} className="text-[10px] h-5">
                                {roleConfig.label}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Mail className="h-3 w-3" />
                            {member.email}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                            Agregado: {new Date(member.addedAt).toLocaleDateString("es")}
                        </p>
                    </div>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(member)}
                            className="h-7 w-7 p-0"
                        >
                            <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDelete}
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
