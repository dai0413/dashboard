import { FormTypeMap } from "../../types/models";
import { OptionsMap } from "../../utils/createOption";
import { keyMap } from "./keyMap";

export function getOptionKey<T extends keyof FormTypeMap>(
  key: keyof FormTypeMap[T] | string,
): keyof OptionsMap {
  if (typeof key === "string" && key.includes(".")) {
    const parts = key.split(".");
    const last = parts[parts.length - 1];
    return keyMap[last] ?? (last as keyof OptionsMap);
  }
  return keyMap[key as string] ?? (key as keyof OptionsMap);
}
