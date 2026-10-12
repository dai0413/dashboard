import { API_PATHS, QueryParams, sortByPosition } from "@dai0413/myorg-shared";
import { api } from "../../../../../context/api-context";
import { createItemBase, readItemsBase } from "../../../../../lib/api";
import {
  PlayerAppearance,
  PlayerAppearanceGet,
} from "../../../../../types/models/player-appearance";
import { getFormationCounts } from "../../../../../utils/data";
import { convert } from "../../../../../lib/convert/DBtoGetted";
import { ModelType } from "../../../../../types/models";
import {
  PlayerRegistration,
  PlayerRegistrationGet,
} from "../../../../../types/models/player-registration";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { FormationCounts } from "../types";
import { getAgeLabel } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/utils";

type LoadPlayerStatisticsParams = {
  teamId: string;
  date: string[];
  matchIds: string[];
  setPlayerAppearance?: React.Dispatch<
    React.SetStateAction<PlayerAppearanceGet[]>
  >;
  setPlayerRegistrations?: React.Dispatch<
    React.SetStateAction<PlayerRegistrationGet[]>
  >;
  setPlayerStatistics: React.Dispatch<React.SetStateAction<PlayerStatistic[]>>;
  setFormationCounts: React.Dispatch<React.SetStateAction<FormationCounts[]>>;
};

const convertPlayerStatistics = (
  playerStatistics: PlayerStatistic[],
  playerRegistrations: PlayerRegistrationGet[],
  date: string[],
) => {
  const players = playerStatistics.map((statistic) => {
    const targetRegister = playerRegistrations.find(
      (p) => p.player.id === statistic.player._id,
    );

    let note: string | undefined;

    if (targetRegister?.isTypeTwo) note = "2種";
    if (targetRegister?.isSpecialDesignation) note = "特指";

    return {
      ...statistic,
      ageLabel: statistic.player.dob
        ? getAgeLabel(
            new Date(statistic.player.dob),
            new Date(date[0]),
            new Date(date[1]),
          )
        : undefined,
      note,
    };
  });

  return sortByPosition(players, "mainPosition");
};

const createPlayerStatisticsParams = (
  playerAppearance: PlayerAppearanceGet[],
  playerRegistrations: PlayerRegistrationGet[],
  teamId: string,
  matchIds: string[],
): QueryParams => {
  const playerIds: string[] = [
    ...new Set(
      [
        ...playerAppearance.map((p) => p.player.id),
        ...playerRegistrations.map((p) => p.player.id),
      ].filter((p) => typeof p === "string"),
    ),
  ];

  const params: QueryParams = {
    player: playerIds,
    team: teamId,
    match: matchIds,
  };

  if (matchIds.length > 0) {
    params["_id"] = matchIds;
  }

  return params;
};

export const loadPlayerStatistics = async ({
  teamId,
  date,
  matchIds,
  setPlayerAppearance,
  setPlayerRegistrations,
  setPlayerStatistics,
  setFormationCounts,
}: LoadPlayerStatisticsParams): Promise<void> => {
  // フォーメーション集計
  const formationCounts = await getFormationCounts(teamId, matchIds);
  setFormationCounts && setFormationCounts(formationCounts ?? []);

  // 出場記録
  let newPlayerAppearance: PlayerAppearanceGet[] = [];

  if (matchIds.length > 0) {
    const playerAppearanceRes = await readItemsBase<PlayerAppearance[]>({
      apiInstance: api,
      backendRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
      params: { getAll: true, team: teamId, match: matchIds },
    });

    if (playerAppearanceRes?.data) {
      newPlayerAppearance = convert(
        ModelType.PLAYER_APPEARANCE,
        playerAppearanceRes.data,
      );
    }
  }

  setPlayerAppearance && setPlayerAppearance(newPlayerAppearance);

  // 登録情報
  const playerRegistrationRes = await readItemsBase<PlayerRegistration[]>({
    apiInstance: api,
    backendRoute: API_PATHS.PLAYER_REGISTRATION.ROOT,
    params: { getAll: true, team: teamId, date },
  });

  const newPlayerRegistrations = playerRegistrationRes?.data
    ? convert(ModelType.PLAYER_REGISTRATION, playerRegistrationRes.data)
    : [];

  setPlayerRegistrations && setPlayerRegistrations(newPlayerRegistrations);

  const params = createPlayerStatisticsParams(
    newPlayerAppearance,
    newPlayerRegistrations,
    teamId,
    matchIds,
  );

  // 選手統計
  const playerStatistic = await createItemBase<PlayerStatistic[]>({
    apiInstance: api,
    backendRoute: API_PATHS.AGGREGATE.PLAYER.STATISTICS,
    data: params,
  });

  if (!playerStatistic?.success) return;

  const players = convertPlayerStatistics(
    playerStatistic.data,
    newPlayerRegistrations,
    date,
  );

  setPlayerStatistics &&
    setPlayerStatistics(sortByPosition(players, "mainPosition"));
};
