import { QuickFilterData, QuickFilterType } from "../../../../types/table";
import { useFormation } from "./useFormation";
import { useMatchEventType } from "./useMatchEventType";
import { useMatchFormat } from "./useMatchFormat";
import { useTeam } from "./useTeam";

export const useQuickFilterSource = (
  type?: QuickFilterType,
): QuickFilterData & { loading: boolean } => {
  const team = useTeam();
  const matchEventType = useMatchEventType();
  const formation = useFormation();
  const matchFormat = useMatchFormat();

  if (type === QuickFilterType.TEAM)
    return { name: "team", items: team.items, loading: team.loading };
  if (type === QuickFilterType.MATCH_EVENT_TYPE)
    return {
      name: "matchEventType",
      items: matchEventType.items,
      loading: matchEventType.loading,
    };
  if (type === QuickFilterType.FORMATION)
    return {
      name: "formation",
      items: formation.items,
      loading: formation.loading,
    };
  if (type === QuickFilterType.MATCH_FORMAT)
    return {
      name: "matchFormat",
      items: matchFormat.items,
      loading: matchFormat.loading,
    };

  return { name: "", items: [], loading: false };
};
