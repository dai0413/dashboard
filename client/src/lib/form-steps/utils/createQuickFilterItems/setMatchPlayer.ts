import { AxiosInstance } from "axios";
import { ModelType } from "../../../../types/models";
import { readItemsBase } from "../../../api";
import { API_PATHS, FilterableFieldDefinition } from "@dai0413/myorg-shared";
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
  competition: Competition,
  season: Season,
): Promise<FilterableFieldDefinition | undefined> => {
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
  startDate?: Date,
  endDate?: Date,
): Promise<FilterableFieldDefinition | undefined> => {
  const labelParts = [
    startDate && `${toKey(new Date(startDate))}から`,
    endDate && `${toKey(new Date(endDate))}に所属した選手`,
  ].filter(Boolean);

  const fromDateRange = {
    label: labelParts.join(""),
    value: [
      startDate ? `>=${toKey(new Date(startDate))}` : "",
      endDate ? `<=${toKey(new Date(endDate))}` : "",
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

export const setPlayerQuickFilter = async (
  api: AxiosInstance,
  teamId: string,
  competition?: Competition,
  season?: Season,
  transferFromDate?: Date,
  transferToDate?: Date,
): Promise<Partial<
  Record<ModelType | OptionType, QuickFilterItem[]>
> | null> => {
  let result: QuickFilterItem[] = [];

  const onRegisterFilterCondition =
    competition && season
      ? await getRegistration(api, teamId, competition, season)
      : undefined;

  const onTransferFilterCondition = await getTransfer(
    api,
    teamId,
    transferFromDate,
    transferToDate,
  );

  if (onRegisterFilterCondition) {
    result.push({
      key: "register",
      label: "登録中",
      filterCondition: onRegisterFilterCondition,
      defaultSelect: true,
    });
  }

  if (onTransferFilterCondition) {
    result.push({
      key: "transfer",
      label: "所属中",
      filterCondition: onTransferFilterCondition,
    });
  }

  return {
    player: result,
  };
};
