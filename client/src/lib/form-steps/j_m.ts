import { convert } from "../convert/DBtoGetted";
import { convert as createLabel } from "../convert/CreateLabel";
import { DraftData, FormStep, PostedDraftData } from "../../types/form";
import { ModelType } from "../../types/models";
import { PlayerAppearance } from "../../types/models/player-appearance";
import { DataResoonse } from "../../types/api";
import { createConfirmationStep } from "./confirmationStep";
import { match } from "./j_m/match";
import { playerAppearance } from "./j_m/playerAppearance";
import { playerMatchEventLog } from "./j_m/playerMatchEventLog";
import { staffAppearance } from "./j_m/staffAppearance";
import { refereeAppearance } from "./j_m/refereeAppearance";

export const steps: Partial<Record<ModelType, FormStep<any>[]>> = {
  [ModelType.MATCH]: [
    ...match,
    createConfirmationStep<ModelType.MATCH>(ModelType.MATCH),
  ],
};

const afterMatchUpdateDraftData = (
  _draftData: DraftData,
  postedDraftData: PostedDraftData,
  res: DataResoonse,
  scrapingUrl: string,
): PostedDraftData => {
  let result = postedDraftData;

  const convertData = convert(ModelType.MATCH, res.data);
  const label = createLabel(ModelType.MATCH, res.data);
  result = {
    [scrapingUrl]: {
      ...result[scrapingUrl],
      matchLabel: label,
      match: { ...convertData },
    },
  };

  return result;
};

const afterPlayerAppearanceUpdateDraftData = (
  _draftData: DraftData,
  postedDraftData: PostedDraftData,
  res: DataResoonse,
  scrapingUrl: string,
): PostedDraftData => {
  let result = postedDraftData;
  const { home_team, away_team } = postedDraftData[scrapingUrl].match;

  const playerAppearance: PlayerAppearance[] = res.data;

  const home = convert(
    ModelType.PLAYER_APPEARANCE,
    playerAppearance.filter((d) => d.team._id === home_team.id),
  );
  const away = convert(
    ModelType.PLAYER_APPEARANCE,
    playerAppearance.filter((d) => d.team._id === away_team.id),
  );

  result = {
    [scrapingUrl]: {
      ...result[scrapingUrl],
      playerAppearance: { home, away },
    },
  };

  return result;
};

const allStep: FormStep<any>[] = [
  ...match,
  {
    ...createConfirmationStep<ModelType.MATCH>(ModelType.MATCH),
    updateDraftData: afterMatchUpdateDraftData,
  },
  ...playerAppearance,
  {
    ...createConfirmationStep<ModelType.PLAYER_APPEARANCE>(
      ModelType.PLAYER_APPEARANCE,
    ),
    updateDraftData: afterPlayerAppearanceUpdateDraftData,
  },
  ...playerMatchEventLog,
  createConfirmationStep<ModelType.PLAYER_MATCH_EVENT_LOG>(
    ModelType.PLAYER_MATCH_EVENT_LOG,
  ),
  ...staffAppearance,
  createConfirmationStep<ModelType.STAFF_APPEARANCE>(
    ModelType.STAFF_APPEARANCE,
  ),
  ...refereeAppearance,
  createConfirmationStep<ModelType.REFEREE_APPEARANCE>(
    ModelType.REFEREE_APPEARANCE,
  ),
];

export const getJ_Msteps = <T extends ModelType>(
  modelType: T,
  all?: boolean,
): FormStep<T>[] => {
  if (all) return allStep as FormStep<T>[];

  return (steps[modelType] as FormStep<T>[] | undefined) ?? [];
};
