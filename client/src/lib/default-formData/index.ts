import { competitionStage } from "./competition-stage";
import { injury } from "./injury";
import { nationalCallup } from "./national-callup";
import { team } from "./team";
import { FormTypeMap, GettedModelDataMap, ModelType } from "../../types/models";
import { playerRegistration } from "./play-registration";

const defaultDatamap: Partial<
  Record<ModelType, FormTypeMap[ModelType] | GettedModelDataMap[ModelType]>
> = {
  [ModelType.COMPETITION_STAGE]: competitionStage,
  [ModelType.INJURY]: injury,
  [ModelType.NATIONAL_CALLUP]: nationalCallup,
  [ModelType.PLAYER_REGISTRATION]: playerRegistration,
  [ModelType.TEAM]: team,
};

export function getDefault<T extends ModelType>(
  modelType: T
): FormTypeMap[T] | GettedModelDataMap[ModelType] {
  const defaultValue = defaultDatamap[modelType];
  if (defaultValue) return defaultValue;
  return {};
}
