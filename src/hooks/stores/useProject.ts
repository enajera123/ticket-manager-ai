import { useProjectStore } from "@/store/useProjectStore"
import { useEffect } from "react"

export function useProject() {
    const store = useProjectStore()
    const loadProjects = useProjectStore((s) => s.getProjects)

    useEffect(() => {
        loadProjects()
    }, [loadProjects])

    return {
        ...store,
    }
}