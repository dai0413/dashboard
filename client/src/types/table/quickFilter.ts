import { FilterableFieldDefinition } from "@dai0413/myorg-shared";

export type QuickFilterItem = {
  key: string;
  label: string;
  filterCondition?: FilterableFieldDefinition[];
  onClick?: (() => void) | (() => Promise<void>);
  defaultSelect?: boolean;
  removeKey?: string[];
};
export enum QuickFilterType {
  TEAM = "team",
  PLAYER_FOR_MATCH = "player-for-match",
  NATIONAL_CALLUP = "national-callup",
  MATCH_EVENT_TYPE = "match-event-type",
  FORMATION = "formation",
  MATCH_FORMAT = "match-format",
  COMPETITION = "competition",
}
