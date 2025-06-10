import { Injury, InjuryForm, InjuryGet } from "./injury";
import { Player, PlayerForm, PlayerGet } from "./player";
import { Transfer, TransferForm, TransferGet } from "./transfer";
import { APP_ROUTES } from "../../lib/appRoutes";

export enum ModelType {
  PLAYER = "player",
  TRANSFER = "transfer",
  INJURY = "injury",
}

export type ModelDataMap = {
  [ModelType.PLAYER]: Player;
  [ModelType.TRANSFER]: Transfer;
  [ModelType.INJURY]: Injury;
};

export type GettedModelDataMap = {
  [ModelType.PLAYER]: PlayerGet;
  [ModelType.TRANSFER]: TransferGet;
  [ModelType.INJURY]: InjuryGet;
};

export type FormTypeMap = {
  [ModelType.PLAYER]: PlayerForm;
  [ModelType.TRANSFER]: TransferForm;
  [ModelType.INJURY]: InjuryForm;
};

export const ModelRouteMap = {
  [ModelType.PLAYER]: APP_ROUTES.PLAYER,
  [ModelType.TRANSFER]: APP_ROUTES.TRANSFER,
  [ModelType.INJURY]: APP_ROUTES.INJURY,
};
