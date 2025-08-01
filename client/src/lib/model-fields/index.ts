import { ModelType } from "../../types/models";
import { transfer } from "./transfer";
import { injury } from "./injury";
import { player } from "./player";
import { team } from "./team";
import { country } from "./country";

export const fieldDefinition = {
  [ModelType.COUNTRY]: country,
  [ModelType.INJURY]: injury,
  [ModelType.PLAYER]: player,
  [ModelType.TEAM]: team,
  [ModelType.TRANSFER]: transfer,
};
