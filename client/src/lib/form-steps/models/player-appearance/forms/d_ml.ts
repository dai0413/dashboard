import {
  AddPostedDraftData,
  FormStep,
  PostedDraftData,
  StepType,
} from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { bulkBase } from "../fields";
import { createConfirmationStep } from "../../../confirmationStep";
import { PlayerAppearance } from "../../../../../types/models/player-appearance";
import { convert } from "../../../../convert/DBtoGetted";
import { getPreMatchSelect } from "../../../d_ml/preMatchSelectStep";
import { getDraftData } from "../getDraftData";

const afterPlayerAppearanceaddPostedDraftData: AddPostedDraftData = ({
  postedDraftData,
  res,
  metaData,
}) => {
  const card_ids: string[] = metaData.card_ids;

  if (!res.success) return {};

  const playerAppearance: PlayerAppearance[] = res.data;

  const posted: PostedDraftData = Object.fromEntries(
    card_ids.map((card_id) => {
      if (!postedDraftData[card_id].match) return [];

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

type BaseModel = ModelType.PLAYER_APPEARANCE;
const baseModel = ModelType.PLAYER_APPEARANCE;
const matchSelectSteps = getPreMatchSelect<BaseModel>(baseModel, "id");

export const playerAppearance: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "D_M, PLAYER_APPEARANCEモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: getDraftData,
  },
  bulkBase,
  {
    ...createConfirmationStep<BaseModel>(baseModel),
    addPostedDraftData: afterPlayerAppearanceaddPostedDraftData,
  },
];

export const multiModel: FormStep<BaseModel>[] = [
  bulkBase,
  {
    ...createConfirmationStep<BaseModel>(baseModel),
    addPostedDraftData: afterPlayerAppearanceaddPostedDraftData,
  },
];
