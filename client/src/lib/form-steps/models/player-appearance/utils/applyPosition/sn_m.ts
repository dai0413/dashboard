import { readSN_MMap } from "../../../../utils/getDraftData/readMap/readSN_M";
import { readPosition } from "./base";
import { ReadPosition, ReadScraped } from "./types";

const createReadSN_MScraped = (url: string): ReadScraped => {
  return async (api) => {
    if (!readSN_MMap.positions) return undefined;

    const item = await readSN_MMap.positions(api, { url });

    if (!item.success) return undefined;

    return item.data;
  };
};

export const readSN_MPosition = (url: string): ReadPosition => {
  return (api, matchCache, scrapedCache, formData) =>
    readPosition(
      api,
      matchCache,
      scrapedCache,
      formData,
      createReadSN_MScraped(url),
    );
};
