import { DraftData, DraftDataValue } from "../../../../types/form";
import { From } from "../../../../types/types";
import { readD_MMap } from "./readD_M";
import { readJ_MMap } from "./readJ_M";
import { ReadDraftDataParams } from "./types";

export const readDraftData = async (
  props: ReadDraftDataParams,
): Promise<DraftData> => {
  const { api, draftData, readDraftDataKey, from, identifiers } = props;

  const readMap = from === From.D_M ? readD_MMap : readJ_MMap;

  if (!readMap || identifiers.length === 0) return {};

  const entries = await Promise.all(
    identifiers.map(async (url) => {
      const originalData = draftData[url];

      const missingKeys = readDraftDataKey.filter(
        (key) => originalData?.[key] === undefined,
      );

      const responses = await Promise.all(
        missingKeys.map(async (key) => {
          const reader = readMap[key];

          if (!reader) {
            return {
              key,
              response: {
                success: false,
                error: "ERROR : readDraftData.ts this key is not supported",
              },
            };
          }

          const response = await reader(api, url);

          return {
            key,
            response,
          };
        }),
      );

      const data: Partial<DraftDataValue> = {
        ...(originalData ?? {}),
      };

      for (const { key, response } of responses) {
        if (response.success && "data" in response) {
          data[key] = response.data as never;
        }
      }

      return [url, data] as const;
    }),
  );

  return Object.fromEntries(entries);
};
