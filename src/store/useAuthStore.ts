import { toast } from "sonner"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { fetchData } from "@/lib/fetch"
import type { APIResponse } from "@/lib/types"
import type { User } from "@/model/User"


interface AuthState {
    user: User | null
    isAuthenticated: boolean
    getUser: () => User | null
    login: (email: string, password: string) => Promise<boolean>
    logout: () => Promise<boolean>
    signUp: (user: User) => Promise<boolean>
    setUser: (user: User) => void
    forgotPassword: (email: string) => Promise<boolean>
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, _get) => ({
            user: null,
            getUser: () => _get().user,
            isAuthenticated: false,
            forgotPassword: async (email: string) => {
                try {
                    const response = await fetchData<APIResponse<{ email: string }>>("/api/v1/auth/forgotPassword", "POST", undefined, { email })
                    if (response.status !== 200) {
                        toast.error("Error al recuperar la contraseña")
                        console.error("Error al recuperar la contraseña:", response.message)
                        return false
                    }
                    toast.success("Correo de recuperación enviado", {
                        description: "Por favor, revisa tu correo electrónico.",
                    })
                    return true
                } catch (error) {
                    console.error("Error al recuperar la contraseña:", error)
                    toast.error("Error al recuperar la contraseña")
                    return false
                }
            },
            signUp: async (user: User) => {
                try {
                    const response = await fetchData<APIResponse<User>>("/api/v1/auth/signup", "POST", undefined, user)
                    if (response.status !== 200) {
                        toast.error(response.message)
                        console.error("Error al registrarse:", response.message)
                        return false
                    }
                    toast.success("Registro exitoso", {
                        description: "Bienvenido al sistema de administración de Escuela Sabática",
                    })
                    return true
                } catch (error) {
                    console.error("Error al registrarse:", error)
                    toast.error("Error al registrarse")
                    return false
                }
            },
            login: async (email: string, password: string) => {
                try {
                    const response = await fetchData<APIResponse<User & { token: string }>>("/api/v1/auth/login", "POST", undefined, { email, password })
                    if (response.status !== 200) {
                        toast.error("Error al iniciar sesión")
                        console.error("Error al iniciar sesión:", response.message)
                        return false
                    }
                    const user = response.data
                    if (!user.isActive) {
                        toast.warning("Usuario inactivo", {
                            description: "Bienvenido al sistema de administración de Escuela Sabática",
                        })
                        console.error("Usuario inactivo:", user.id)
                        return false
                    }
                    localStorage.setItem("token", user.token)
                    set({ user, isAuthenticated: true })
                    return true
                } catch (error) {
                    console.error("Error al iniciar sesión:", error
                    )
                    toast.error("Error al iniciar sesión")
                    return false
                }
            },
            logout: async () => {
                const response = await fetchData<APIResponse<User>>("/api/v1/auth/signout", "POST")
                if (response.status !== 200) {
                    toast.error("Error al cerrar sesión")
                    console.error("Error al cerrar sesión:", response.message)
                    return false
                }
                localStorage.clear()
                set({ user: null, isAuthenticated: false })
                return true
            },
            setUser: (user: User) => {
                set({ user })
            },
        }),
        {
            name: "auth-store",
        }
    )
)