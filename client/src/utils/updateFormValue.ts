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

export function updateFormValue<T extends object, K extends keyof T>(
  prev: T,
  key: K,
  value: T[K],
  setLabels?:
    | ((updater: (prev: Record<string, any>) => Record<string, any>) => void)
    | null
): T {
  // ✅ 空文字またはnullならundefinedに置き換え
  const normalizedValue = value === "" || value === null ? undefined : value;

  // ドット区切りキー対応
  const path = String(key).split(".");

  // Label オブジェクトか？
  const isLabelObj =
    typeof normalizedValue === "object" &&
    normalizedValue &&
    "key" in normalizedValue &&
    "label" in normalizedValue;

  // setLabels の更新（深いパス対応）
  if (setLabels) {
    setLabels((prevLabel) => {
      if (isLabelObj) {
        return setDeepValue(prevLabel, path, (normalizedValue as any).label);
      }
      return setDeepValue(prevLabel, path, normalizedValue);
    });
  }

  // 保存する値（Labelの場合は .key の方）
  const storedValue = isLabelObj
    ? (normalizedValue as any).key
    : normalizedValue;

  // フォーム値の更新（深いパス対応）
  const next = setDeepValue(prev, path, storedValue);
  return next;
}

// export function updateNestedValue<T extends object>(
//   obj: T,
//   path: string,
//   value: any
// ): T {
//   const keys = path
//     .replace(/\[(\d+)\]/g, ".$1") // matchFormat[0].name → matchFormat.0.name
//     .split(".");

//   const newObj: any = { ...obj };
//   let current: any = newObj;

//   keys.forEach((key, index) => {
//     if (index === keys.length - 1) {
//       current[key] = value;
//     } else {
//       // 中間オブジェクトや配列をコピーして immutability を保つ
//       current[key] = Array.isArray(current[key])
//         ? [...current[key]]
//         : { ...current[key] };
//       current = current[key];
//     }
//   });

//   return newObj;
// }
