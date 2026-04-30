// 深いパスへ安全に書き込む汎用関数
export function setDeepValue(obj: any, path: string[], value: any) {
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

export function deleteDeepValue(obj: any, path: string[]) {
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

export function getDeepValue(obj: any, path: string | string[]) {
  const keys = Array.isArray(path) ? path : path.split(".");

  let cur = obj;

  for (const key of keys) {
    if (cur == null) return undefined;
    cur = cur[key];
  }

  return cur;
}
