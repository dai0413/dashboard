import { QuickFilterType } from "../../../types/table";
import { useFormation } from "./useFormation";
import { useMatchEventType } from "./useMatchEventType";
import { useTeam } from "./useTeam";

export const useQuickFilterSource = (type?: QuickFilterType) => {
  const team = useTeam();
  const matchEventType = useMatchEventType();
  const formation = useFormation();

  if (type === QuickFilterType.TEAM) return team;
  if (type === QuickFilterType.MATCH_EVENT_TYPE) return matchEventType;
  if (type === QuickFilterType.FORMATION) return formation;

  return { items: [], loading: false };
};
