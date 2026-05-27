import { API_PATHS } from "@dai0413/myorg-shared";
import { DataSource, FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createItemBase, readItemBase } from "../../../../api";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/site/l_m/position";
import { Match } from "../../../../../types/models/match";
import { PlayerAppearanceForm } from "../../../../../types/models/player-appearance";

type BaseModel = ModelType.PLAYER_APPEARANCE;
const baseModel = ModelType.PLAYER_APPEARANCE;

export const bulk: FormStep<ModelType.PLAYER_APPEARANCE>[] = [
  {
    stepLabel: "出場状況を入力",
    type: StepType.FORM,
    modelType: baseModel,
    dataSource: DataSource.BULK_COMMON,
    fields: getFields(["match", "team"]),
  },
  {
    stepLabel: "出場状況を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
      "match",
      "team",
      "player",
      "player_name",
      "number",
      "play_status",
      "position",
      "time",
    ]),
    many: true,
    autoFill: async ({ formDatas, formLabels, api }) => {
      if (!api) return { formDatas, formLabels };

      const matchCache = new Map<string, Match>();

      const applyPosition = async (
        formData: PlayerAppearanceForm,
        formLabel: Record<string, any>,
      ): Promise<{
        formData: PlayerAppearanceForm;
        formLabel: Record<string, any>;
      }> => {
        if (!formData.match) return { formData, formLabel };

        let match = matchCache.get(formData.match);
        if (!match) {
          const fetchedMatch = await readItemBase<Match>({
            apiInstance: api,
            backendRoute: API_PATHS.MATCH.DETAIL(formData.match),
          });

          if (!fetchedMatch) {
            return { formData, formLabel };
          }

          match = fetchedMatch;
          matchCache.set(formData.match, match);
        }

        const homeTeam = match.home_team._id;
        const awayTeam = match.away_team._id;

        const alph =
          formData.team === homeTeam
            ? match.home_team.labalph
            : formData.team === awayTeam
              ? match.away_team.labalph
              : undefined;

        if (!alph) return { formData, formLabel };

        const item = await createItemBase<Scraped>({
          apiInstance: api,
          backendRoute: API_PATHS.GET_NEW_DATA.L_M.POSITION,
          data: { date: match.date, alph: alph },
        });

        if (!item.success) return { formData, formLabel };
        const { home, away } = item.data;

        const target =
          formData.team === homeTeam
            ? home
            : formData.team === awayTeam
              ? away
              : undefined;

        if (!target) return { formData, formLabel };

        const position = target.find(
          (d) => d.number === formData.number,
        )?.position;

        const returnValue = {
          ...formData,
          position: position,
        };

        const returnFormLabel = {
          ...formLabel,
          position: position,
        };

        return { formData: returnValue, formLabel: returnFormLabel };
      };

      const applied = await Promise.all(
        formDatas.map((d, i) => applyPosition(d, formLabels[i])),
      );

      const returnFormDatas = applied.map((d) => d.formData);
      const returnFormLabels = applied.map((d) => d.formLabel);

      return {
        formDatas: returnFormDatas,
        formLabels: returnFormLabels,
      };
    },
  },
  createConfirmationStep<BaseModel>(baseModel),
];
