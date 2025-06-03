import { ModelType } from "../../types/models";
import { createConfirmationStep } from "./confirmationStep";
import { transfer } from "./transfer";
import { player } from "./player";
import { injury } from "./injury";

export const steps = {
  [ModelType.TRANSFER]: [
    ...transfer,
    createConfirmationStep<ModelType.TRANSFER>(),
  ],
  [ModelType.PLAYER]: [...player, createConfirmationStep<ModelType.PLAYER>()],
  [ModelType.INJURY]: [...injury, createConfirmationStep<ModelType.INJURY>()],
};
