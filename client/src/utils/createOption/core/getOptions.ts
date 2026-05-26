import { OptionSource, OptionObj } from "../../../types/form/option";
import { OptionsMap, ReadOptionsParam } from "../types/base";
import { ModelDataOption } from "../types/model";
import { DefaultOptionMap, OptionType } from "../types/preset";
import { getDefaultOptions } from "./getDefaultOptions";
import { readOptions } from "./readOptions";

type GetOptionsContext =
  | {
      source: OptionSource.PRESET;
      key: OptionType;
    }
  | {
      source: OptionSource.REMOTE;
      key: keyof ModelDataOption;
      readOptionsParam: Omit<ReadOptionsParam<any>, "key">;
    }
  | {
      source: OptionSource.CUSTOM;
      key: keyof OptionsMap;
      options: Record<string, OptionObj<any>>;
    };

type GetOptionsResult<T extends GetOptionsContext> = T extends {
  source: OptionSource.PRESET;
  key: infer K;
}
  ? K extends OptionType
    ? OptionObj<DefaultOptionMap[K]>
    : never
  : T extends { source: OptionSource.REMOTE; key: infer K }
    ? K extends keyof ModelDataOption
      ? OptionObj<ModelDataOption[K]>
      : never
    : T extends { source: OptionSource.CUSTOM; key: infer K }
      ? K extends keyof OptionsMap
        ? OptionObj<OptionsMap[K]>
        : never
      : never;

export async function getOptions<T extends GetOptionsContext>(
  ctx: T,
): Promise<GetOptionsResult<T>> {
  if (ctx.source === OptionSource.PRESET) {
    return getDefaultOptions(ctx.key) as any;
  }

  if (ctx.source === OptionSource.REMOTE) {
    const data = (await readOptions({
      ...ctx.readOptionsParam,
      key: ctx.key,
    })) as any;
    return data;
  }

  if (ctx.source === OptionSource.CUSTOM) {
    const option = ctx.options[ctx.key];

    if (!option) {
      return { data: [] } as any;
    }

    return option as any;
  }

  return { data: [] } as any;
}
