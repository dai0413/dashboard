import { ModelType } from "../../types/models";
import { transfer } from "./transfer";

export const filterableFields = {
  [ModelType.PLAYER]: [],
  [ModelType.TRANSFER]: transfer,
  [ModelType.INJURY]: [],
  [ModelType.TEAM]: [],
};
