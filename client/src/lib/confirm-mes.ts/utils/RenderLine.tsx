import { JSX } from "react";
import { FormTypeMap } from "../../../types/models";

export type RenderLineOptions<T extends keyof FormTypeMap> = {
  getString?: (filtered: FormTypeMap[T][]) => string;
  countFn?: (filtered: FormTypeMap[T][]) => number;
};

export const RenderLine = <T extends keyof FormTypeMap>(
  formDatas: FormTypeMap[T][],
  label: string,
  filterFn: (d: FormTypeMap[T]) => boolean,

  options?: RenderLineOptions<T>,
): JSX.Element | null => {
  const filtered = formDatas.filter(filterFn);
  if (filtered.length === 0) return null;

  const count = options?.countFn ? options.countFn(filtered) : filtered.length;

  return (
    <div>
      <span className="text-gray-400 ml-2">{`・${label} `}</span>
      <span className="font-bold">
        {`${count}件 ${options?.getString?.(filtered) ?? ""}`}
      </span>
    </div>
  );
};
