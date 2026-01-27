import { AxiosInstance } from "axios";
import { FormTypeMap, ModelType } from "../../../../types/models";
import { readItemBase, readItemsBase } from "../../../api";
import { API_PATHS, FilterableFieldDefinition } from "@dai0413/myorg-shared";
import { Match } from "../../../../types/models/match";
import { OptionType } from "../../../../utils/createOption";
import { QuickFilterItem } from "../../../../types/table";
import { PlayerRegistration } from "../../../../types/models/player-registration";
import { convert } from "../../../convert/CreateLabel";
import { toKey } from "../../../../utils/toDateKey";
import { Competition } from "../../../../types/models/competition";
import { Season } from "../../../../types/models/season";

const getRegistration = async (
  api: AxiosInstance,
  teamId: string,
  match: Match,
): Promise<FilterableFieldDefinition | undefined> => {
  const competition: Competition = match.competition;
  const season: Season = match.season;
  if (!competition || !season) return undefined;
  const resBody = await readItemsBase({
    apiInstance: api,
    backendRoute: API_PATHS.PLAYER_REGISTRATION.ROOT,
    params: {
      getAll: true,
      team: teamId,
      competition: competition._id,
      season: season._id,
      registration_type: "register",
    },
    returnResponse: true,
  });
  if (!resBody || !resBody.data) return undefined;
  const playerRegistrations: PlayerRegistration[] = resBody.data;
  const players = Array.from(
    new Map(
      playerRegistrations
        .map((pr) => pr.player)
        .filter((p) => p._id)
        .map((p) => [p._id, p]),
    ).values(),
  );
  const playersId = players.map((p) => p._id);
  const playersLabel = players.map((p) => convert(ModelType.PLAYER, p));
  if (
    playersId.length !== playersLabel.length ||
    playersId.length === 0 ||
    playersLabel.length === 0
  )
    return undefined;

  return {
    key: "_id",
    label: "選手",
    type: "string",
    filterable: true,
    value: playersId,
    valueLabel: [`${season.name}-${competition.name}登録選手`],
    operator: "equals",
  };
};

const getTransfer = async (
  api: AxiosInstance,
  teamId: string,
  match: Match,
): Promise<FilterableFieldDefinition | undefined> => {
  const matchDate = match.date;
  const seasonStartDate = match.season.start_date;

  const labelParts = [
    seasonStartDate && `${toKey(new Date(seasonStartDate))}から`,
    matchDate && `${toKey(new Date(matchDate))}に所属した選手`,
  ].filter(Boolean);

  const fromDateRange = {
    label: labelParts.join(""),
    value: [
      seasonStartDate ? `>=${toKey(new Date(seasonStartDate))}` : "",
      matchDate ? `<=${toKey(new Date(matchDate))}` : "",
    ].filter(Boolean) as string[],
  };

  const resBody = await readItemsBase({
    apiInstance: api,
    backendRoute: API_PATHS.TRANSFER.ROOT,
    params: {
      getAll: true,
      to_team: teamId,
      form: [
        "更新",
        "完全",
        "期限付き",
        "育成型期限付き",
        "期限付き延長",
        "育成型期限付き延長",
        "復帰",
      ],
      from_date: fromDateRange.value,
    },
    returnResponse: true,
  });

  if (!resBody || !resBody.data) return undefined;
  const playerRegistrations: PlayerRegistration[] = resBody.data;
  const players = Array.from(
    new Map(
      playerRegistrations
        .map((pr) => pr.player)
        .filter((p) => p._id)
        .map((p) => [p._id, p]),
    ).values(),
  );
  const playersId = players.map((p) => p._id);
  const playersLabel = players.map((p) => convert(ModelType.PLAYER, p));
  if (
    playersId.length !== playersLabel.length ||
    playersId.length === 0 ||
    playersLabel.length === 0
  )
    return undefined;

  return {
    key: "_id",
    label: "選手",
    type: "string",
    filterable: true,
    value: playersId,
    valueLabel: [fromDateRange.label],
    operator: "equals",
  };
};

export const setMatchPlayer = async (
  data: FormTypeMap[ModelType.PLAYER_APPEARANCE],
  api?: AxiosInstance,
): Promise<Partial<
  Record<ModelType | OptionType, QuickFilterItem[]>
> | null> => {
  if (!data.match || !data.team || !api) return null;

  const matchResBody = await readItemBase({
    apiInstance: api,
    backendRoute: API_PATHS.MATCH.DETAIL(data.match),
    returnResponse: true,
  });

  const match: Match = matchResBody.data;

  if (!match) return null;

  const onRegisterFilterCondition = await getRegistration(
    api,
    data.team,
    match,
  );

  const onTransferFilterCondition = await getTransfer(api, data.team, match);

  return {
    player: [
      {
        key: "register",
        label: "登録中",
        filterCondition: onRegisterFilterCondition,
        defaultSelect: true,
      },
      {
        key: "transfer",
        label: "所属中",
        filterCondition: onTransferFilterCondition,
      },
    ],
  };
};
