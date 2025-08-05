import { ModelType } from "../../types/models";
import { createConfirmationStep } from "./confirmationStep";
import { transfer } from "./transfer";
import { player } from "./player";
import { injury } from "./injury";
import { team } from "./team";
import { country } from "./country";
import { nationalMatchSeries } from "./national-match-series";

export const steps = {
  [ModelType.COUNTRY]: [
    ...country,
    createConfirmationStep<ModelType.COUNTRY>(),
  ],
  [ModelType.INJURY]: [...injury, createConfirmationStep<ModelType.INJURY>()],
  [ModelType.NATIONAL_MATCH_SERIES]: [
    ...nationalMatchSeries,
    createConfirmationStep<ModelType.NATIONAL_MATCH_SERIES>(),
  ],
  [ModelType.PLAYER]: [...player, createConfirmationStep<ModelType.PLAYER>()],
  [ModelType.TEAM]: [...team, createConfirmationStep<ModelType.TEAM>()],
  [ModelType.TRANSFER]: [
    ...transfer,
    createConfirmationStep<ModelType.TRANSFER>(),
  ],
};
