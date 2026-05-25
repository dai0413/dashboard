import { FormStep } from "../../../types/form";
import { FormTypeMap } from "../../../types/models";
import { From, GetStepsArgs } from "../../../types/types";
import { formStepsMap } from "./formStepsMap";
import { d_mlStep } from "./getD_MLsteps";
import { j_mStep } from "./getJ_Msteps";
import { l_mStep } from "./getL_Msteps";

type GetStepsReturnVal<T extends keyof FormTypeMap> = {
  label: string;
  steps: FormStep<T>[];
};

export const getSteps = <T extends keyof FormTypeMap>({
  modelType,
  inputMode,
  from = From.NORMAL,
  relatedAll = false,
}: GetStepsArgs<T>): GetStepsReturnVal<T> | null => {
  if (relatedAll) {
    if (from === From.L_M) {
      return l_mStep as GetStepsReturnVal<T>;
    } else if (from === From.J_M) {
      return j_mStep as GetStepsReturnVal<T>;
    } else if (from === From.D_ML) {
      return d_mlStep as GetStepsReturnVal<T>;
    }
  }

  return formStepsMap[modelType]?.[inputMode]?.[from] ?? null;
};
