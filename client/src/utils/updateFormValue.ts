// 深いパスへ安全に書き込む汎用関数
function setDeepValue(obj: any, path: string[], value: any) {
  const newObj = { ...obj };
  let cur = newObj;

  for (let i = 0; i < path.length - 1; i++) {
    const p = path[i];
    cur[p] = cur[p] ? { ...cur[p] } : {};
    cur = cur[p];
  }

  cur[path[path.length - 1]] = value;
  return newObj;
}

function deleteDeepValue(obj: any, path: string[]) {
  const newObj = { ...obj };
  let cur = newObj;

  for (let i = 0; i < path.length - 1; i++) {
    const p = path[i];
    if (!cur[p]) return newObj;
    cur[p] = { ...cur[p] };
    cur = cur[p];
  }

  delete cur[path[path.length - 1]];
  return newObj;
}

function getDeepValue(obj: any, path: string | string[]) {
  const keys = Array.isArray(path) ? path : path.split(".");

  let cur = obj;

  for (const key of keys) {
    if (cur == null) return undefined;
    cur = cur[key];
  }

  return cur;
}

const normalize = (val: any) => (val === "" || val === null ? undefined : val);

const isLabelObj = (val: any) =>
  typeof val === "object" && val && "key" in val && "label" in val;

const isSame = (a: any, b: any) => {
  if (isLabelObj(a) && isLabelObj(b)) return a.key === b.key;
  if (isLabelObj(a) && !isLabelObj(b)) return a.key === b;
  if (!isLabelObj(a) && isLabelObj(b)) return a === b.key;

  return a === b;
};

const getKey = (v: any) => (isLabelObj(v) ? v.key : v);
const getLabel = (v: any) => (isLabelObj(v) ? v.label : v);

type UpdateResult<T extends object> = {
  updatedValue: T;
  updatedLabel: Record<string, any>;
};

type LabelObj = {
  key: string;
  label: string;
};

export function updateFormValue<T extends object, K extends keyof T>(
  prev: T,
  prevLabel: Record<string, any>,
  key: K,
  value: T[K] | LabelObj | undefined,
  isArray?: boolean,
): UpdateResult<T> {
  console.log("start", value);

  const path = String(key).split(".");

  const normalizedValue = normalize(value);

  const currentValue = getDeepValue(prev, path);
  const currentLabel = getDeepValue(prevLabel, path);

  let storedValue;
  let labelValue;

  if (isArray) {
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
      const nextVal = currentValArr.filter((v) => v !== targetKey);
      const index = currentValArr.findIndex((v) => v === targetKey);

      const nextLabel = currentLabelArr.filter((_, i) => i !== index);

      storedValue = nextVal;
      labelValue = nextLabel;
    } else {
      storedValue = [...currentValArr, targetKey];
      labelValue = [...currentLabelArr, targetLabel];
    }
  } else {
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
