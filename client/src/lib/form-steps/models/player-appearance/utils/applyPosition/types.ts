import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/data/position";
import { AxiosInstance } from "axios";
import { Match } from "../../../../../../types/models/match";
import { PlayerAppearanceForm } from "../../../../../../types/models/player-appearance";

export type ReadScraped = (
  api: AxiosInstance,
  match: Match,
  formData: PlayerAppearanceForm,
) => Promise<Scraped | undefined>;

export type ReadPosition = (
  api: AxiosInstance,
  matchCache: Map<string, Promise<Match | undefined>>,
  scrapedCache: Map<string, Promise<Scraped | undefined>>,
  formData: PlayerAppearanceForm,
) => Promise<string | undefined>;
