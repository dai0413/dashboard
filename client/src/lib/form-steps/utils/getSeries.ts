import { AxiosInstance } from "axios";
import { readItemsBase } from "../../api";
import { API_PATHS } from "@dai0413/myorg-shared";
import { NationalMatchSeries } from "../../../types/models/national-match-series";

const readSeries = async (
  api: AxiosInstance,
  params: Record<string, string>,
  team: string,
) => {
  const obj = await readItemsBase<NationalMatchSeries[]>({
    apiInstance: api,
    backendRoute: API_PATHS.NATIONAL_MATCH_SERIES.ROOT,
    params: {
      sort: "-joined_at",
      limit: 1,
      team,
      ...params,
    },
  });

  if (!obj || !(obj.data.length === 1)) return undefined;

  const seriesId = obj.data[0]._id;

  return seriesId;
};

export const getSeries = async (
  team?: string,
  api?: AxiosInstance,
  match?: string,
  date?: Date,
) => {
  if (!match || !api || !team) return undefined;

  let seriesId: string | undefined;

  seriesId = await readSeries(api, { matches: match }, team);

  if (seriesId) return seriesId;

  seriesId = await readSeries(
    api,
    {
      joined_at: `<=${date}`,
    },
    team,
  );

  return seriesId;
};
