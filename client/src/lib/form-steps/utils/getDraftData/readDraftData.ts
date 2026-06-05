import { DraftData, DraftDataValue } from "../../../../types/form";
import { readMap } from "./readMap";
import { ReadDraftDataParams, ReadFun } from "./types";

export const readDraftData = async (
  props: ReadDraftDataParams,
): Promise<DraftData> => {
  const { api, draftData, requests, identifiers } = props;

  if (identifiers.length === 0) return {};

  const entries = await Promise.all(
    identifiers.map(async (identifier) => {
      const originalData = draftData[identifier];

      const missingKeys = requests.filter(
        ({ draftDataKey }) => originalData?.[draftDataKey] === undefined,
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
        if (response.success && "data" in response) {
          data[draftDataKey] = response.data as never;
        }
      }

      return [identifier, data] as const;
    }),
  );

  return Object.fromEntries(entries);
};
