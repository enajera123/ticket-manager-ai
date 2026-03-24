import { useMemberStore } from "@/store/useMemberStore"

/**
 * Hook for member operations with local state management.
 * Members are persisted locally (not fetched from server).
 */
export function useMember() {
  const members = useMemberStore((s) => s.members)
  const createMember = useMemberStore((s) => s.createMember)
  const updateMember = useMemberStore((s) => s.updateMember)
  const deleteMember = useMemberStore((s) => s.deleteMember)
  const getMemberById = useMemberStore((s) => s.getMemberById)
  const getMembersByProject = useMemberStore((s) => s.getMembersByProject)

  return {
    members,
    createMember,
    updateMember,
    deleteMember,
    getMemberById,
    getMembersByProject,
  }
}