import { ModelType } from "../../types/models";
import { transfer } from "./transfer";
import { injury } from "./injury";
import { player } from "./player";
import { team } from "./team";

export const fieldDefinition = {
  [ModelType.PLAYER]: player,
  [ModelType.TRANSFER]: transfer,
  [ModelType.INJURY]: injury,
  [ModelType.TEAM]: team,
};
