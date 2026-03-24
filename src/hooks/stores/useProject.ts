import { useProjectStore } from "@/store/useProjectStore"
import { useEffect } from "react"

/**
 * Hook for project operations with auto-loading on mount.
 * Automatically fetches projects when first used.
 */
export function useProject() {
  const projects = useProjectStore((s) => s.projects)
  const currentProject = useProjectStore((s) => s.currentProject)
  const getProjects = useProjectStore((s) => s.getProjects)
  const setCurrentProject = useProjectStore((s) => s.setCurrentProject)

  useEffect(() => {
    getProjects()
  }, [getProjects])

  const createProject = useProjectStore((s) => s.createProject)
  const updateProject = useProjectStore((s) => s.updateProject)
  const deleteProject = useProjectStore((s) => s.deleteProject)

  return {
    projects,
    currentProject,
    setCurrentProject,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects: getProjects,
  }
}
