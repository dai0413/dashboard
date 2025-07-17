import { ModelType } from "../../types/models";
import { transfer } from "./transfer";

export const fieldDefinition = {
  [ModelType.PLAYER]: [],
  [ModelType.TRANSFER]: transfer,
  [ModelType.INJURY]: [],
  [ModelType.TEAM]: [],
};
