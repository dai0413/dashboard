import { FormFieldDefinition, UpdateMode } from "../../types/form";
import { isSame } from "./helpers/compare";
import {
  deleteDeepValue,
  getDeepValue,
  setDeepValue,
} from "./helpers/deepValue";
import { getKey, getLabel, isLabelObj } from "./helpers/label";
import { normalize } from "./helpers/normalize";
import { resolveMode } from "./resolveMode";

type UpdateResult<T extends object> = {
  updatedValue: T;
  updatedLabel: Record<string, any>;
};

type LabelObj = {
  key: string;
  label: string;
};

type UpdateFormValueParams<T extends object, K extends keyof T> = {
  prev: T;
  prevLabel: Record<string, any>;
  key: K;
  value: T[K] | LabelObj | undefined;
  field: FormFieldDefinition<any>;
  index?: number;
  updateMode?: UpdateMode;
};

export function updateFormValue<T extends object, K extends keyof T>(
  params: UpdateFormValueParams<T, K>,
): UpdateResult<T> {
  // console.log("params", params);
  const updateMode = params.updateMode
    ? params.updateMode
    : resolveMode(params.field);
  const { prev, prevLabel, key, value } = params;
  const index = params.index ? params.index : 0;

  // console.log("start", value);

  const path = String(key).split(".");

  const normalizedValue = normalize(value);

  const currentValue = getDeepValue(prev, path);
  const currentLabel = getDeepValue(prevLabel, path);

  let storedValue;
  let labelValue;

  if (updateMode === UpdateMode.REPLACE) {
    if (isSame(currentValue, normalizedValue)) {
      storedValue = undefined;
      labelValue = undefined;
    } else {
      storedValue = isLabelObj(normalizedValue)
        ? getKey(normalizedValue)
        : normalizedValue;

      labelValue = isLabelObj(normalizedValue)
        ? getLabel(normalizedValue)
        : normalizedValue;
    }
  }

  if (updateMode === UpdateMode.TOGGLE) {
    const currentValArr = Array.isArray(currentValue) ? currentValue : [];
    const currentLabelArr = Array.isArray(currentLabel) ? currentLabel : [];

    const targetKey = isLabelObj(normalizedValue)
      ? getKey(normalizedValue)
      : normalizedValue;

    const targetLabel = isLabelObj(normalizedValue)
      ? getLabel(normalizedValue)
      : normalizedValue;

    const exists = currentValArr.some((v) => v === targetKey);

    if (exists) {
      const index = currentValArr.findIndex((v) => v === targetKey);

      storedValue = currentValArr.filter((_, i) => i !== index);
      labelValue = currentLabelArr.filter((_, i) => i !== index);
    } else {
      storedValue = [...currentValArr, targetKey];
      labelValue = [...currentLabelArr, targetLabel];
    }
  }

  if (updateMode === UpdateMode.ARRAY_UPDATE) {
    const currentValArr = Array.isArray(currentValue) ? currentValue : [];
    const currentLabelArr = Array.isArray(currentLabel) ? currentLabel : [];

    const nextValArr = [...currentValArr];
    const nextLabelArr = [...currentLabelArr];

    // console.log("currentValArr", currentValArr, normalizedValue);

    if (normalizedValue === undefined || normalizedValue === "") {
      // 削除
      nextValArr.splice(index, 1);
      nextLabelArr.splice(index, 1);
    } else {
      const val = isLabelObj(normalizedValue)
        ? getKey(normalizedValue)
        : normalizedValue;

      const label = isLabelObj(normalizedValue)
        ? getLabel(normalizedValue)
        : normalizedValue;

      nextValArr[index] = val;
      nextLabelArr[index] = label;
    }

    storedValue = nextValArr;
    labelValue = nextLabelArr;
  }

  // console.log("updated value", storedValue, labelValue);

  const isEmpty =
    storedValue === undefined ||
    (Array.isArray(storedValue) && storedValue.length === 0);

  const updatedValue = isEmpty
    ? deleteDeepValue(prev, path)
    : setDeepValue(prev, path, storedValue);

  const updatedLabel = isEmpty
    ? deleteDeepValue(prevLabel, path)
    : setDeepValue(prevLabel, path, labelValue);

  console.log("final value", updatedValue, updatedLabel);

  return {
    updatedValue,
    updatedLabel,
  };
}
