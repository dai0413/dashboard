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
  const updateMode = params.updateMode
    ? params.updateMode
    : resolveMode(params.field);
  const { prev, prevLabel, key, value } = params;

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

    const val = isLabelObj(normalizedValue)
      ? getKey(normalizedValue)
      : normalizedValue;

    const label = isLabelObj(normalizedValue)
      ? getLabel(normalizedValue)
      : normalizedValue;

    const index = params.index;

    const exists = currentValArr.some((v) => v === val);

    if (exists) {
      const index = currentValArr.findIndex((v) => v === val);

      storedValue = currentValArr.filter((_, i) => i !== index);
      labelValue = currentLabelArr.filter((_, i) => i !== index);
    } else if (index === undefined) {
      // 全削除のみ許可
      if (normalizedValue === undefined || normalizedValue === "") {
        storedValue = [];
        labelValue = [];
      } else {
        console.error("indexなしで値更新はNG");
        storedValue = currentValArr;
        labelValue = currentLabelArr;
      }
    } else {
      if (normalizedValue === undefined || normalizedValue === "") {
        // 削除
        nextValArr.splice(index, 1);
        nextLabelArr.splice(index, 1);

        storedValue = nextValArr;
        labelValue = nextLabelArr;
      } else {
        // 更新 or 追加
        nextValArr[index] = val;
        nextLabelArr[index] = label;

        storedValue = nextValArr;
        labelValue = nextLabelArr;
      }
    }
  }

  const isEmpty =
    storedValue === undefined ||
    (Array.isArray(storedValue) && storedValue.length === 0);

  const updatedValue = isEmpty
    ? deleteDeepValue(prev, path)
    : setDeepValue(prev, path, storedValue);

  const updatedLabel = isEmpty
    ? deleteDeepValue(prevLabel, path)
    : setDeepValue(prevLabel, path, labelValue);

  return {
    updatedValue,
    updatedLabel,
  };
}
