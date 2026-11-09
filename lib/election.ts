import type { ElectionStatus } from "@/constants/enums"
import type { Election } from "@/types/election"

export const filterByStatus = (
  elections: Election[],
  statuses: ElectionStatus[]
) => elections.filter((e) => statuses.includes(e.status))

export const countPositions = (elections: Election[]) =>
  elections.reduce((total, e) => total + e.positions.length, 0)
