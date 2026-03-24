import { convert } from "../convert/DBtoGetted";
import { convert as createLabel } from "../convert/CreateLabel";
import { AddPostedDraftData, FormStep } from "../../types/form";
import { ModelType } from "../../types/models";
import { PlayerAppearance } from "../../types/models/player-appearance";
import { createConfirmationStep } from "./confirmationStep";
import { match } from "./j_m/match";
import { playerAppearance } from "./j_m/playerAppearance";
import { playerMatchEventLog } from "./j_m/playerMatchEventLog";
import { staffAppearance } from "./j_m/staffAppearance";
import { refereeAppearance } from "./j_m/refereeAppearance";
import { Match } from "../../types/models/match";

export const steps: Partial<Record<ModelType, FormStep<any>[]>> = {
  [ModelType.MATCH]: [
    ...match,
    createConfirmationStep<ModelType.MATCH>(ModelType.MATCH),
  ],
};

const afterMatchaddPostedDraftData: AddPostedDraftData = ({
  postedDraftData,
  res,
  metaData,
}) => {
  let result = postedDraftData;
  const getDataUrl = metaData.getDataUrl;

  const matchOriginal: Match = res.data;

  const match = convert(ModelType.MATCH, matchOriginal);
  const label = createLabel(ModelType.MATCH, matchOriginal);
  const periods = matchOriginal.match_format?.period;
  result = {
    [getDataUrl]: {
      ...result[getDataUrl],
      matchLabel: label,
      match: { ...match },
      periods,
    },
  };

  return result;
};

const afterPlayerAppearanceaddPostedDraftData: AddPostedDraftData = ({
  postedDraftData,
  res,
  metaData,
}) => {
  let result = postedDraftData;
  const getDataUrl = metaData.getDataUrl;

  const { home_team, away_team } = postedDraftData[getDataUrl].match;

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
    [getDataUrl]: {
      ...result[getDataUrl],
      playerAppearance: { home, away },
    },
  };

  return result;
};

const allStep: FormStep<any>[] = [
  ...match,
  {
    ...createConfirmationStep<ModelType.MATCH>(ModelType.MATCH),
    addPostedDraftData: afterMatchaddPostedDraftData,
  },
  ...playerAppearance,
  {
    ...createConfirmationStep<ModelType.PLAYER_APPEARANCE>(
      ModelType.PLAYER_APPEARANCE,
    ),
    addPostedDraftData: afterPlayerAppearanceaddPostedDraftData,
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
