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

  if (
    typeof normalizedValue === "object" &&
    normalizedValue &&
    "key" in normalizedValue &&
    "label" in normalizedValue
  ) {
    if (setLabels) {
      setLabels((prev) => ({
        ...prev,
        [key as string]: (normalizedValue as any).label,
      }));
    }
    return { ...prev, [key]: (normalizedValue as any).key };
  }

  if (setLabels) {
    setLabels((prev) => ({ ...prev, [key as string]: normalizedValue }));
  }

  return { ...prev, [key]: normalizedValue };
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
