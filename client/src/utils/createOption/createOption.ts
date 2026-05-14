import { OptionSource, OptionObj } from "../../types/form/option";
import {
  GettedModelDataMap,
  ModelDataMap,
  ModelType,
} from "../../types/models";
import {
  competition,
  season,
  team,
  country,
  nationalMatchSeries,
  player,
  competitionStage,
  stadium,
  matchFormat,
  match,
  staff,
  matchEventType,
  formation,
} from "./Model";
import {
  status,
  positionGroup,
  leftReason,
  ageGroup,
  area,
  district,
  confederation,
  subConfederation,
  position,
  form,
  genre,
  competitionType,
  category,
  level,
  stageType,
  division,
  periodLabel,
  result,
  registrationType,
  operator,
  event_type,
  position_formation,
  special_time,
  play_status,
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import {
  CustomOptionType,
  DefaultOptionMap,
  OptionsMap,
  OptionType,
} from "./types/base";
import { AxiosInstance } from "axios";
import { normalizeFiltersForApi } from "../filter/normalizeFiltersForApi";
import { readItemsBase } from "../../lib/api";
import { convert } from "../../lib/convert/DBtoGetted";
import { optionRouteMap } from "../../lib/options";
import { isModelType } from "../../types/field";
import { ModelDataOption, ModelOptionKey } from "./types/optionTable";

type Converter<T extends ModelOptionKey> = (
  data: GettedModelDataMap[T][],
) => OptionObj<ModelDataOption[T]>;

const convertMap: Partial<{
  [K in ModelOptionKey]: Converter<K>;
}> = {
  [ModelType.COUNTRY]: (data) => country(data),
  [ModelType.MATCH]: (data) => match(data),
  [ModelType.MATCH_FORMAT]: (data) => matchFormat(data),
  [ModelType.MATCH_EVENT_TYPE]: (data) => matchEventType(data),
  [ModelType.NATIONAL_MATCH_SERIES]: (data) => nationalMatchSeries(data),
  [ModelType.PLAYER]: (data) => player(data),
  [ModelType.SEASON]: (data) => season(data),
  [ModelType.STADIUM]: (data) => stadium(data),
  [ModelType.STAFF]: (data) => staff(data),
  [ModelType.TEAM]: (data) => team(data),
  [ModelType.COMPETITION_STAGE]: (data) => competitionStage(data),
  [ModelType.COMPETITION]: (data) => competition(data),
  [ModelType.FORMATION]: (data) => formation(data),
};

const defaultOptions: Partial<
  {
    [K in keyof DefaultOptionMap]: OptionObj<DefaultOptionMap[K]>;
  } & { [K in keyof DefaultOptionMap]: OptionObj<DefaultOptionMap[K]> }
> = {
  [OptionType.STATUS]: { data: status() },
  [OptionType.POSITION_GROUP]: { data: positionGroup() },
  [OptionType.LEFT_REASON]: { data: leftReason() },
  [OptionType.AGE_GROUP]: { data: ageGroup() },
  [OptionType.AREA]: { data: area() },
  [OptionType.DISTRICT]: { data: district() },
  [OptionType.CONFEDERATION]: { data: confederation() },
  [OptionType.SUB_CONFEDERATION]: { data: subConfederation() },
  [OptionType.POSITION]: { data: position() },
  [OptionType.FORM]: { data: form() },
  [OptionType.GENRE]: { data: genre() },
  [OptionType.OPERATOR]: { data: operator() },
  [OptionType.COMPETITION_TYPE]: { data: competitionType() },
  [OptionType.CATEGORY]: { data: category() },
  [OptionType.LEVEL]: { data: level() },
  [OptionType.CURRENT]: {
    data: [
      { key: "true", label: "最新" },
      { key: "false", label: "" },
    ],
  },
  [OptionType.IS_INJURED]: {
    data: [
      { key: "true", label: "負傷中" },
      { key: "false", label: "復帰済み" },
    ],
  },
  [OptionType.STAGE_TYPE]: { data: stageType() },
  [OptionType.DIVISION]: { data: division() },
  [OptionType.PERIOD_LABEL]: { data: periodLabel() },
  [OptionType.RESULT]: { data: result() },
  [OptionType.REGISTRATION_TYPE]: { data: registrationType() },
  [OptionType.EVENT_TYPE]: { data: event_type() },
  [OptionType.POSITION_FORMATION]: { data: position_formation() },
  [OptionType.SPECIAL_TIME]: { data: special_time() },
  [OptionType.PLAY_STATUS]: { data: play_status() },
  [CustomOptionType.CARD_IDS]: { data: [] },
};

export function convertToOption<T extends ModelOptionKey>(
  type: T,
  data: GettedModelDataMap[T][],
): OptionObj<ModelDataOption[T]> {
  if (!(type in convertMap)) return { data: [] };

  const converter = convertMap[type];
  if (!converter) {
    console.error(`No converter found for ${String(type)}`);
    return { data: [] };
  }
  return converter(data);
}

export function getDefaultOptions<T extends OptionType>(
  key: T,
): OptionObj<DefaultOptionMap[T]> {
  const options = defaultOptions[key];

  if (!options) {
    console.error(`No options found for ${String(key)}`);
    return { data: [] };
  }

  return options;
}

type ReadOptionsParam<T extends keyof OptionsMap> = {
  key: T;
  api: AxiosInstance;
  filterConditions?: FilterableFieldDefinition[];
  sortConditions?: SortableFieldDefinition[];
  page: number;
};

export const readOptions = async <K extends ModelOptionKey>({
  key,
  api,
  filterConditions,
  sortConditions,
  page,
}: ReadOptionsParam<K>): Promise<OptionObj<ModelDataOption[K]>> => {
  const crudRoutes = optionRouteMap[key];
  const { ROOT: route } = crudRoutes;

  if (!route) {
    console.error("ROOT が未定義です:", key);
    return { data: [] };
  }

  const params: Record<string, any> = { getAll: true };

  if (filterConditions?.length) {
    params.filters = JSON.stringify(normalizeFiltersForApi(filterConditions));
  }

  if (sortConditions?.length) {
    params.sorts = JSON.stringify(sortConditions);
  }

  if (!isModelType(key)) return { data: [] };

  const response = await readItemsBase<ModelDataMap[K][]>({
    apiInstance: api,
    backendRoute: route,
    params,
    returnResponse: true,
  });

  if (!response) return { data: [] };

  const getted = convert(key, response.data);
  const options = convertToOption(key, getted);

  return {
    data: options.data,
    fields: options.fields,
    page: page ?? response.page ?? 1,
    totalCount: response.totalCount ?? 1,
  };
};

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
    return readOptions({
      ...ctx.readOptionsParam,
      key: ctx.key,
    }) as any;
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
