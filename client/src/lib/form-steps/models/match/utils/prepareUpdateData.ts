import { UpdateData } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { API_PATHS } from "@dai0413/myorg-shared";
import { api } from "../../../../../context/api-context";
import { Match, MatchForm, MatchGet } from "../../../../../types/models/match";
import { readItemsBase } from "../../../../api";
import { convert } from "../../../../convert/DBtoGetted";
import { convertGettedToForm } from "../../../../convert/GettedtoForm";
import { PrepareUpdateData } from "../../../../../types/form/prepareUpdateData";

const convertToLabel = (t: MatchGet) => {
  return {
    ...t,
    competition_stage: t.competition_stage.label,
    home_team: t.home_team.label,
    away_team: t.away_team.label,
    match_format: t.match_format ? t.match_format.label : undefined,
    stadium: t.stadium ? t.stadium.label : undefined,
  };
};

export const prepareUpdateData: PrepareUpdateData<MatchForm, true> = async ({
  metaData,
  formDatas,
  formLabels,
}) => {
  const res = await readItemsBase<Match[]>({
    apiInstance: api,
    backendRoute: API_PATHS.MATCH.ROOT,
    params: {
      competition: metaData.competition,
      match_week: metaData.match_week,
      competition_stage: metaData.competition_stage,
      season: metaData.season,
      getAll: true,
    },
  });

  if (!res)
    return {
      originalDatas: [],
      formDatas: [],
      formLabels: [],
      metaData: [],
      metaDataLabel: [],
    };

  const matches = convert(ModelType.MATCH, res.data);

  let newFormDatas: MatchForm[] = [];
  let newFormLabels: Record<string, any>[] = [];
  let originalDatas: UpdateData<MatchForm>[] = [];

  formDatas.forEach((formData, formDataIndex) => {
    const index = matches.findIndex(
      (d) =>
        d.home_team.id === formData?.home_team &&
        d.away_team.id === formData?.away_team &&
        d.competition_stage.id === formData?.competition_stage,
    );

    const convertedToForm = convertGettedToForm(
      ModelType.MATCH,
      matches[index],
    );
    const convertedToLabel = convertToLabel(matches[index]);

    const newOriginalData = convertGettedToForm(
      ModelType.MATCH,
      matches[index],
    ) as UpdateData<MatchForm>;
    const newFormData = { ...convertedToForm, ...formData };
    const newFormLabel = {
      ...convertedToLabel,
      ...formLabels[formDataIndex],
    };

    newFormDatas.push(newFormData);
    newFormLabels.push(newFormLabel);
    originalDatas.push(newOriginalData);
  });

  return {
    originalDatas: originalDatas,
    formDatas: newFormDatas,
    formLabels: newFormLabels,
    metaData: metaData,
    metaDataLabel: {},
  };
};
