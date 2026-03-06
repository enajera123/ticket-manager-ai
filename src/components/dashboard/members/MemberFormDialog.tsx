import { Formik, Form } from "formik"
import * as Yup from "yup"
import { AppDialog } from "@/components/common/AppDialog"
import InputField from "@/components/common/InputField"
import { useMemberStore } from "@/store/useMemberStore"
import type { Member, MemberRole } from "@/model/Member"
import { Mail, User, Shield } from "lucide-react"

const MemberSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es requerido"),
    email: Yup.string().email("Email inválido").required("El email es requerido"),
    role: Yup.mixed<MemberRole>().oneOf(["OWNER", "ADMIN", "MEMBER", "VIEWER"]).required("El rol es requerido"),
})

const ROLES: { value: MemberRole; label: string; description: string }[] = [
    { value: "OWNER", label: "Propietario", description: "Control total del proyecto" },
    { value: "ADMIN", label: "Administrador", description: "Gestiona miembros y configuración" },
    { value: "MEMBER", label: "Miembro", description: "Crea y edita tickets" },
    { value: "VIEWER", label: "Observador", description: "Solo visualiza tickets" },
]

interface MemberFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    projectId: number
    member?: Member | null
}

export function MemberFormDialog({ open, onOpenChange, projectId, member }: MemberFormDialogProps) {
    const { createMember, updateMember } = useMemberStore()
    const isEdit = !!member

    return (
        <AppDialog
            open={open}
            onOpenChange={onOpenChange}
            title={isEdit ? "Editar Miembro" : "Agregar Miembro"}
            description={isEdit ? member.email : "Agrega un nuevo miembro al proyecto"}
            maxWidth="max-w-lg"
        >
            <Formik
                initialValues={{
                    name: member?.name || "",
                    email: member?.email || "",
                    role: member?.role || "MEMBER" as MemberRole,
                }}
                validationSchema={MemberSchema}
                onSubmit={(values) => {
                    if (isEdit && member) {
                        updateMember(member.id, values)
                    } else {
                        createMember({
                            ...values,
                            projectId,
                        })
                    }
                    onOpenChange(false)
                }}
            >
                {({ values, handleChange }) => (
                    <Form className="space-y-4">
                        <InputField
                            name="name"
                            label="Nombre"
                            placeholder="Ej: Juan Pérez"
                            tooltip="Nombre completo del miembro"
                            icon={<User />}
                        />

                        <InputField
                            name="email"
                            type="email"
                            label="Email"
                            placeholder="juan@ejemplo.com"
                            tooltip="Email del miembro"
                            icon={<Mail />}
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Rol
                            </label>
                            <div className="space-y-2">
                                {ROLES.map((role) => (
                                    <label
                                        key={role.value}
                                        className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                                            values.role === role.value
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={role.value}
                                            checked={values.role === role.value}
                                            onChange={handleChange}
                                            className="mt-1"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">{role.label}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {role.description}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <button
                                type="button"
                                onClick={() => onOpenChange(false)}
                                className="px-4 py-2 text-sm rounded-md hover:bg-muted"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                            >
                                {isEdit ? "Actualizar" : "Agregar"} Miembro
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </AppDialog>
    )
}
