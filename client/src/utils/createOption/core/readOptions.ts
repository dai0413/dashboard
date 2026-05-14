import { ModelDataMap } from "../../../types/models";
import { ReadOptionsParam } from "../types/base";
import { normalizeFiltersForApi } from "../../filter/normalizeFiltersForApi";
import { readItemsBase } from "../../../lib/api";
import { convert } from "../../../lib/convert/DBtoGetted";
import { optionRouteMap } from "../../../lib/options";
import { isModelType } from "../../../types/field";
import { ModelDataOption, ModelOptionKey } from "../types/model";
import { OptionObj } from "../../../types/form/option";
import { convertToOption } from "./convertToOption";

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
    returnResponse: true,
  });

  if (!response) return { data: [] };

  const getted = convert(key, response.data);
  const options = convertToOption(key, getted);

  return {
    data: options.data,
    fields: options.fields,
    page: page ?? response.page ?? 1,
    totalCount: response.totalCount ?? 1,
  };
};
