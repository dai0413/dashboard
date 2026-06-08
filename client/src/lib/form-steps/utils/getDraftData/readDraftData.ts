import { CreateItemResponse } from "@dai0413/myorg-shared";
import { DraftData, DraftDataValue } from "../../../../types/form";
import { mergePositions } from "../../core/mergePositions";
import { readMap } from "./readMap";
import { ReadDraftDataParams, ReadFun } from "./types";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/data/draftData";

export const readDraftData = async (
  props: ReadDraftDataParams,
): Promise<DraftData> => {
  const { api, draftData, requests, identifiers } = props;

  if (identifiers.length === 0) return {};

  let newDraftData = draftData;

  const hasValuesKey = requests.find(
    ({ draftDataKey }) => draftDataKey === "values",
  );

  if (hasValuesKey) {
    const mapByKey = readMap[hasValuesKey.draftDataKey];
    const { from, params } = hasValuesKey;

    const reader: ReadFun<"values"> = mapByKey[from as keyof typeof mapByKey];
    const response: CreateItemResponse<Scraped | undefined> = await reader(
      api,
      params,
    );

    if (response.success && response.data) {
      newDraftData = response.data;
    }
  }

  const entries = await Promise.all(
    identifiers.map(async (identifier) => {
      const originalData = newDraftData[identifier];

      const missingKeys = requests.filter(
        ({ draftDataKey }) =>
          draftDataKey !== "values" &&
          originalData?.[draftDataKey] === undefined,
      );

      const responses = await Promise.all(
        missingKeys.map(async (missingKey) => {
          const { draftDataKey, from, params } = missingKey;

          const mapByKey = readMap[missingKey.draftDataKey];

          if (!(missingKey.from in mapByKey)) {
            return {
              draftDataKey: missingKey.draftDataKey,
              response: {
                success: false,
                error: "unsupported",
              },
            };
          }

          const reader: ReadFun<any> = mapByKey[from as keyof typeof mapByKey];

          if (!reader) {
            return {
              draftDataKey,
              response: {
                success: false,
                error: "ERROR : readDraftData.ts this key is not supported",
              },
            };
          }

          const response = await reader(api, params);

          return {
            draftDataKey,
            response,
          };
        }),
      );

      const data: Partial<DraftDataValue> = {
        ...(originalData ?? {}),
      };

      for (const { draftDataKey, response } of responses) {
        if (
          response.success &&
          "data" in response &&
          draftDataKey !== "values"
        ) {
          data[draftDataKey] = response.data as never;
        }
      }

      return [identifier, data] as const;
    }),
  );

  const updatedDraftData = Object.fromEntries(entries);

  const mergedDraftData = mergePositions(updatedDraftData);

  return mergedDraftData;
};
