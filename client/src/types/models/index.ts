import { Injury, InjuryForm, InjuryGet } from "./injury";
import { Player, PlayerForm, PlayerGet } from "./player";
import { Transfer, TransferForm, TransferGet } from "./transfer";

export enum ModelType {
  PLAYER = "player",
  TRANSFER = "transfer",
  INJURY = "injury",
}

export type RawDataMap = {
  [ModelType.PLAYER]: Player;
  [ModelType.TRANSFER]: Transfer;
  [ModelType.INJURY]: Injury;
};

export type ConvertedDataMap = {
  [ModelType.PLAYER]: PlayerGet;
  [ModelType.TRANSFER]: TransferGet;
  [ModelType.INJURY]: InjuryGet;
};

export type FormTypeMap = {
  [ModelType.PLAYER]: PlayerForm;
  [ModelType.TRANSFER]: TransferForm;
  [ModelType.INJURY]: InjuryForm;
};
