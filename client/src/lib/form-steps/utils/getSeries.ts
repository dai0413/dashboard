import { AxiosInstance } from "axios";
import { readItemsBase } from "../../api";
import { API_PATHS } from "@dai0413/myorg-shared";
import { NationalMatchSeries } from "../../../types/models/national-match-series";

export const getSeries = async (api?: AxiosInstance, match?: string) => {
  if (!match || !api) return undefined;

  const obj = await readItemsBase<NationalMatchSeries[]>({
    apiInstance: api,
    backendRoute: API_PATHS.NATIONAL_MATCH_SERIES.ROOT,
    params: {
      getAll: true,
      matches: match,
    },
  });

  if (!obj || !(obj.data.length === 1)) return undefined;

  const seriesId = obj.data[0]._id;

  return seriesId;
};
