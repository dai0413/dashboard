import { ModelDataMap, ModelType } from "../../../types/models";
import { ReadOptionsParam } from "../types/base";
import { normalizeFiltersForApi } from "../../filter/normalizeFiltersForApi";
import { readItemsBase } from "../../../lib/api";
import { optionRouteMap } from "../../../lib/options";
import { isModelType } from "../../../types/field";
import { ModelDataOption, ModelOptionKey } from "../types/model";
import { OptionObj } from "../../../types/form/option";
import { convertToOption } from "./convertToOption";
import { positionGroup } from "@dai0413/myorg-shared";

const position_group = positionGroup().map((v) => v.key);

export const readOptions = async <K extends ModelOptionKey>({
  key,
  api,
  filterConditions,
  sortConditions,
  page,
}: ReadOptionsParam<K>): Promise<OptionObj<ModelDataOption[K]>> => {
  const crudRoutes = optionRouteMap[key];
  const { ROOT: route } = crudRoutes;

  if (!route) {
    console.error("ROOT が未定義です:", key);
    return { data: [] };
  }

  const params: Record<string, any> = { getAll: true };

  if (filterConditions?.length) {
    params.filters = JSON.stringify(normalizeFiltersForApi(filterConditions));
  }

  if (sortConditions?.length) {
    params.sorts = JSON.stringify(sortConditions);
  }

  if (!isModelType(key)) return { data: [] };

  const response = await readItemsBase<ModelDataMap[K][]>({
    apiInstance: api,
    backendRoute: route,
    params,
  });

  if (!response) return { data: [] };

  let uniqued = response.data;

  if (key === "national-callup") {
    const datas = response.data as ModelDataMap[ModelType.NATIONAL_CALLUP][];

    const nationalCallups = [
      ...new Map(datas.map((d) => [d.player._id, d])).values(),
    ].sort(
      (a, b) =>
        position_group.findIndex((v) => v === a.position_group) -
        position_group.findIndex((v) => v === b.position_group),
    );

    uniqued = nationalCallups as typeof uniqued;
  }

  const options = convertToOption(key, uniqued);

  return {
    data: options.data,
    fields: options.fields,
    page: page ?? response.page ?? 1,
    totalCount: uniqued.length ?? 1,
  };
};
