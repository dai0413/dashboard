import { AxiosInstance } from "axios";
import { getOptionKey } from "../../lib/options";
import { isModelType } from "../../types/field";
import { ModelType } from "../../types/models";
import { getLabelById } from "../model/getLabelById";

export async function resolveForeignKeyLabels(
  api: AxiosInstance,
  initialFormLabel: Record<string, any>,
) {
  const resolved = { ...initialFormLabel };

  for (const key of Object.keys(resolved)) {
    const id = resolved[key];
    if (!id || !isModelType(getOptionKey(key))) continue;

    if (Array.isArray(id)) {
      resolved[key] = (
        await Promise.all(id.map((i) => getLabelById(api, key as ModelType, i)))
      ).filter(Boolean);
    } else {
      resolved[key] = await getLabelById(api, key as ModelType, id);
    }
  }

  return resolved;
}
