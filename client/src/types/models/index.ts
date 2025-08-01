import { APP_ROUTES } from "../../lib/appRoutes";
import { Injury, InjuryForm, InjuryGet } from "./injury";
import { Player, PlayerForm, PlayerGet } from "./player";
import { Transfer, TransferForm, TransferGet } from "./transfer";
import { Team, TeamForm, TeamGet } from "./team";
import { Country, CountryForm, CountryGet } from "./country";

export enum ModelType {
  PLAYER = "player",
  TRANSFER = "transfer",
  INJURY = "injury",
  TEAM = "team",
  COUNTRY = "country",
}

export type ModelDataMap = {
  [ModelType.PLAYER]: Player;
  [ModelType.TRANSFER]: Transfer;
  [ModelType.INJURY]: Injury;
  [ModelType.TEAM]: Team;
  [ModelType.COUNTRY]: Country;
};

export type GettedModelDataMap = {
  [ModelType.PLAYER]: PlayerGet;
  [ModelType.TRANSFER]: TransferGet;
  [ModelType.INJURY]: InjuryGet;
  [ModelType.TEAM]: TeamGet;
  [ModelType.COUNTRY]: CountryGet;
};

export type FormTypeMap = {
  [ModelType.PLAYER]: PlayerForm;
  [ModelType.TRANSFER]: TransferForm;
  [ModelType.INJURY]: InjuryForm;
  [ModelType.TEAM]: TeamForm;
  [ModelType.COUNTRY]: CountryForm;
};

export const ModelRouteMap = {
  [ModelType.PLAYER]: APP_ROUTES.PLAYER,
  [ModelType.TRANSFER]: APP_ROUTES.TRANSFER,
  [ModelType.INJURY]: APP_ROUTES.INJURY,
  [ModelType.TEAM]: APP_ROUTES.TEAM,
  [ModelType.COUNTRY]: APP_ROUTES.COUNTRY,
};
