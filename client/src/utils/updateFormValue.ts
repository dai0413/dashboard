export function updateFormValue<T extends object, K extends keyof T>(
  prev: T,
  key: K,
  value: T[K]
): T {
  // 同じ値をクリックしたら解除
  if (prev[key] === value) {
    return { ...prev, [key]: null };
  }
  // 違う値なら更新
  return { ...prev, [key]: value };
}
