import { convert } from "../../convert/DBtoGetted";
import { convert as createLabel } from "../../convert/CreateLabel";
import { FormStep } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { PlayerAppearance } from "../../../types/models/player-appearance";
import { createConfirmationStep } from "../confirmationStep";
import { Match } from "../../../types/models/match";
import {
  AddPostedDraftData,
  PostedDraftData,
} from "../../../types/form/postedDraftData";
import { match } from "../models/match/forms/d_ml";
import { playerAppearance } from "../models/player-appearance/forms/d_ml";
import { playerMatchEventLog } from "../models/player-match-event-log/forms/d_ml";
import { staffAppearance } from "../models/staff-appearance/forms/d_ml";
import { refereeAppearance } from "../models/referee-appearance/forms/d_ml";

const steps: Partial<Record<ModelType, FormStep<any>[]>> = {
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
  const card_ids: string[] = metaData.card_ids;

  const matchOriginal: Match[] = res.data;

  const posted: PostedDraftData = Object.fromEntries(
    matchOriginal.map((match, i) => {
      const matchData = convert(ModelType.MATCH, match);
      const label = createLabel(ModelType.MATCH, match);

      const periods = match.match_format?.period;
      const card_id = card_ids[i];

      return [
        card_id,
        {
          ...postedDraftData[card_id],
          matchLabel: label,
          match: { ...matchData },
          periods,
        },
      ];
    }),
  );

  return posted;
};

const afterPlayerAppearanceaddPostedDraftData: AddPostedDraftData = ({
  postedDraftData,
  res,
  metaData,
}) => {
  const card_ids: string[] = metaData.card_ids;

  const playerAppearance: PlayerAppearance[] = res.data;

  const posted: PostedDraftData = Object.fromEntries(
    card_ids.map((card_id) => {
      const {
        _id: matchId,
        home_team,
        away_team,
      } = postedDraftData[card_id].match;

      const home = convert(
        ModelType.PLAYER_APPEARANCE,
        playerAppearance.filter(
          (d) => d.match._id === matchId && d.team._id === home_team.id,
        ),
      );
      const away = convert(
        ModelType.PLAYER_APPEARANCE,
        playerAppearance.filter(
          (d) => d.match._id === matchId && d.team._id === away_team.id,
        ),
      );

      return [
        card_id,
        {
          ...postedDraftData[card_id],
          playerAppearance: { home, away },
        },
      ];
    }),
  );

  return posted;
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

export const getD_MLsteps = <T extends ModelType>(
  modelType: T,
  all?: boolean,
): FormStep<T>[] => {
  if (all) return allStep as FormStep<T>[];

  return (steps[modelType] as FormStep<T>[] | undefined) ?? [];
};
