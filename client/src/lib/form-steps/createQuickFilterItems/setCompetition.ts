import { AxiosInstance } from "axios";
import {
  CreateQuickFilterItems,
  QuickFilterItemsByKey,
} from "../../../types/form";
import { API_PATHS, FilterableFieldDefinition } from "@dai0413/myorg-shared";
import { Competition } from "../../../types/models/competition";
import { readItemsBase } from "../../api";
import { convert } from "../../convert/DBtoGetted";
import { convert as createLabel } from "../../convert/CreateLabel";
import { FormTypeMap, ModelType } from "../../../types/models";
import { QuickFilterItem } from "../../../types/table";
import { ReadCompetitionItems } from "../types";

type SetCompetitionParams<K extends keyof FormTypeMap> = Parameters<
  CreateQuickFilterItems<K>
>[0] & {
  items: ReadCompetitionItems[];
};

export const setCompetition = async <K extends keyof FormTypeMap>({
  api,
  items,
}: SetCompetitionParams<K>) => {
  if (!api) return null;

  const read = async (
    api: AxiosInstance,
    readParams: Record<string, string>,
  ): Promise<FilterableFieldDefinition | undefined> => {
    const obj = await readItemsBase<Competition[]>({
      apiInstance: api,
      params: { getAll: true, ...readParams },
      backendRoute: API_PATHS.COMPETITION.ROOT,
    });

    if (!obj) return;
    const competitions = convert(ModelType.COMPETITION, obj.data);

    const filterCondition: FilterableFieldDefinition = {
      key: "_id",
      label: "大会",
      operator: "equals",
      type: "select",
      value: competitions.map((t) => t._id),
      valueLabel: obj.data.map((t) => createLabel(ModelType.COMPETITION, t)),
    };

    return filterCondition;
  };

  let quickFilterItems: QuickFilterItem[] = [];

  for (const item of items) {
    const { params, ...rest } = item;
    const data = await read(api, params);

    quickFilterItems.push({
      ...rest,
      filterCondition: data,
    });
  }

  const obj: QuickFilterItemsByKey | null = {
    competition: quickFilterItems,
  };

  return obj;
};
