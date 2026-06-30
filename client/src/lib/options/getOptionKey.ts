import { FormTypeMap } from "../../types/models";
import { OptionsMap } from "../../utils/createOption/types/base";
import { keyMap } from "./keyMap";

export function getOptionKey<T extends keyof FormTypeMap>(
  key: keyof FormTypeMap[T] | string,
): keyof OptionsMap {
  let returnKey: keyof OptionsMap | null;
  if (typeof key === "string" && key.includes(".")) {
    const parts = key.split(".");
    const last = parts[parts.length - 1];
    returnKey = keyMap[last];
  } else {
    returnKey = keyMap[key as string];
  }

  if (!returnKey) {
    console.error("option用のkey設定エラー", key);
  }

  return returnKey;
}
