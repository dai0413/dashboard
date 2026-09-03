import { AxiosInstance } from "axios";
import { API_PATHS } from "@dai0413/myorg-shared";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/data/position";
import { Match } from "../../../../../../types/models/match";
import { PlayerAppearanceForm } from "../../../../../../types/models/player-appearance";
import { ReadScraped } from "./types";
import { readItemBase } from "../../../../../api";

const readMatch = async (
  api: AxiosInstance,
  matchCache: Map<string, Promise<Match | undefined>>,
  matchId: string,
): Promise<Match | undefined> => {
  let promise = matchCache.get(matchId);

  if (!promise) {
    promise = readItemBase<Match>({
      apiInstance: api,
      backendRoute: API_PATHS.MATCH.DETAIL(matchId),
    });

    matchCache.set(matchId, promise);
  }

  return promise;
};

const readCachedScraped = async (
  api: AxiosInstance,
  match: Match,
  formData: PlayerAppearanceForm,
  scrapedCache: Map<string, Promise<Scraped | undefined>>,
  readScraped: ReadScraped,
): Promise<Scraped | undefined> => {
  const matchId = match._id;

  let promise = scrapedCache.get(matchId);

  if (!promise) {
    promise = readScraped(api, match, formData);
    scrapedCache.set(matchId, promise);
  }

  return promise;
};

export const readPosition = async (
  api: AxiosInstance,
  matchCache: Map<string, Promise<Match | undefined>>,
  scrapedCache: Map<string, Promise<Scraped | undefined>>,
  formData: PlayerAppearanceForm,
  readScraped: ReadScraped,
): Promise<string | undefined> => {
  if (!formData.match) return undefined;

  const match = await readMatch(api, matchCache, formData.match);

  if (!match) return undefined;

  const data = await readCachedScraped(
    api,
    match,
    formData,
    scrapedCache,
    readScraped,
  );

  if (!data) return undefined;

  const target =
    formData.team === match.home_team._id
      ? data.home
      : formData.team === match.away_team._id
        ? data.away
        : undefined;

  return target?.find((d) => d.number === formData.number)?.position;
};
