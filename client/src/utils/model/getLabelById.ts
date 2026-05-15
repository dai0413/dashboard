import { readItemBase } from "../../lib/api";
import { getOptionKey, optionRouteMap } from "../../lib/options";
import { isModelType } from "../../types/field";
import { ModelDataMap, ModelType } from "../../types/models";

import { convert as createLabel } from "../../lib/convert/CreateLabel";
import { AxiosInstance } from "axios";

export async function getLabelById<T extends ModelType>(
  api: AxiosInstance,
  optionKey: T,
  id: string,
): Promise<string | undefined> {
  const key = getOptionKey(optionKey);

  if (!isModelType(key)) {
    console.error("optionKeyの不備:", key);
    return;
  }

  const route = optionRouteMap[key].DETAIL(id);
  if (!route) {
    console.error("optionRouteMapの不備:", key);
    return;
  }

  let fetchedItem: string | null = null;

  const data = await readItemBase<ModelDataMap[typeof key]>({
    apiInstance: api,
    backendRoute: route,
  });

  if (data) fetchedItem = createLabel(key, data as ModelDataMap[typeof key]);

  return fetchedItem ?? undefined;
}
