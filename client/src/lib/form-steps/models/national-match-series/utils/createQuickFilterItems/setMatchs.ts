import { API_PATHS } from "@dai0413/myorg-shared";
import { AxiosInstance } from "axios";
import { FormTypeMap, ModelType } from "../../../../../../types/models";
import { readItemsBase } from "../../../../../api";
import { QuickFilterItem } from "../../../../../../types/table";
import { convert } from "../../../../../convert/CreateLabel";
import { Match } from "../../../../../../types/models/match";

export const setMatchs = async (
  data?: FormTypeMap[ModelType.NATIONAL_MATCH_SERIES],
  api?: AxiosInstance | undefined,
) => {
  if (!api || !data || !data.team) return null;

  const date: string[] = [];
  if (data.joined_at) date.push(`>=${data.joined_at}`);
  if (data.left_at) date.push(`<=${data.left_at}`);

  const matches = await readItemsBase<Match[]>({
    apiInstance: api,
    backendRoute: API_PATHS.MATCH.ROOT,
    params: {
      getAll: true,
      sort: "date",
      team: data.team,
      date,
    },
  });

  if (!matches) return null;

  const value = matches.data.map((match) => match._id);
  const valueLabel = matches.data.map((match) =>
    convert(ModelType.MATCH, match),
  );

  let result: QuickFilterItem[] = [
    {
      key: "match",
      label: "試合",
      filterCondition: {
        key: "_id",
        label: "試合",
        type: "string",
        filterable: true,
        value,
        valueLabel,
        operator: "equals",
      },
      defaultSelect: true,
    },
  ];

  return { match: result };
};
