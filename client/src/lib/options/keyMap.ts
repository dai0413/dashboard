import { ModelType } from "../../types/models";
import { OptionsMap } from "../../utils/createOption";

export const keyMap: Record<string, keyof OptionsMap> = {
  citizenship: ModelType.COUNTRY,
  from_team: ModelType.TEAM,
  to_team: ModelType.TEAM,
  home_team: ModelType.TEAM,
  away_team: ModelType.TEAM,
  series: ModelType.NATIONAL_MATCH_SERIES,
  parent_stage: ModelType.COMPETITION_STAGE,
  competition_stage: ModelType.COMPETITION_STAGE,
  match_format: ModelType.MATCH_FORMAT,
};
