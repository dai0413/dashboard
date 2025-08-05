import { APP_ROUTES } from "../../lib/appRoutes";
import { Injury, InjuryForm, InjuryGet } from "./injury";
import { Player, PlayerForm, PlayerGet } from "./player";
import { Transfer, TransferForm, TransferGet } from "./transfer";
import { Team, TeamForm, TeamGet } from "./team";
import { Country, CountryForm, CountryGet } from "./country";
import {
  NationalMatchSeries,
  NationalMatchSeriesForm,
  NationalMatchSeriesGet,
} from "./national-match-series";

export enum ModelType {
  COUNTRY = "country",
  INJURY = "injury",
  NATIONAL_MATCH_SERIES = "national-match-series",
  PLAYER = "player",
  TEAM = "team",
  TRANSFER = "transfer",
}

export type ModelDataMap = {
  [ModelType.COUNTRY]: Country;
  [ModelType.INJURY]: Injury;
  [ModelType.NATIONAL_MATCH_SERIES]: NationalMatchSeries;
  [ModelType.PLAYER]: Player;
  [ModelType.TEAM]: Team;
  [ModelType.TRANSFER]: Transfer;
};

export type GettedModelDataMap = {
  [ModelType.COUNTRY]: CountryGet;
  [ModelType.INJURY]: InjuryGet;
  [ModelType.NATIONAL_MATCH_SERIES]: NationalMatchSeriesGet;
  [ModelType.PLAYER]: PlayerGet;
  [ModelType.TEAM]: TeamGet;
  [ModelType.TRANSFER]: TransferGet;
};

export type FormTypeMap = {
  [ModelType.COUNTRY]: CountryForm;
  [ModelType.INJURY]: InjuryForm;
  [ModelType.NATIONAL_MATCH_SERIES]: NationalMatchSeriesForm;
  [ModelType.PLAYER]: PlayerForm;
  [ModelType.TEAM]: TeamForm;
  [ModelType.TRANSFER]: TransferForm;
};

export const ModelRouteMap = {
  [ModelType.COUNTRY]: APP_ROUTES.COUNTRY,
  [ModelType.INJURY]: APP_ROUTES.INJURY,
  [ModelType.NATIONAL_MATCH_SERIES]: APP_ROUTES.NATIONAL_MATCH_SERIES,
  [ModelType.PLAYER]: APP_ROUTES.PLAYER,
  [ModelType.TEAM]: APP_ROUTES.TEAM,
  [ModelType.TRANSFER]: APP_ROUTES.TRANSFER,
};
