import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../lib/appRoutes";
import { Tooltip } from "@mui/material";
import React, { useMemo, useState } from "react";
import { PlayerAppearanceGet } from "../../types/models/player-appearance";
import { MatchGet } from "../../types/models/match";
import { ModelType } from "../../types/models";
import { convert } from "../../lib/convert/DBtoGetted";
import { MatrixParams } from "../../types/table/matrix";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { positionColorMap } from "../../styles/colors";
import { useFilter } from "../../context/filter-context";
import { toDateKey } from "@dai0413/myorg-shared/normalizer";

const sortDob = (a: PlayerStatistic, b: PlayerStatistic) => {
  if (!a.player.dob && !b.player.dob) return 0;
  if (!a.player.dob) return 1;
  if (!b.player.dob) return -1;

  return new Date(a.player.dob).getTime() - new Date(b.player.dob).getTime();
};

const calcAge = (dob: Date, base: Date): number => {
  const birthYear = dob.getUTCFullYear();
  const birthMonth = dob.getUTCMonth();
  const birthDate = dob.getUTCDate();

  let age = base.getFullYear() - birthYear;

  const hasBirthdayPassed =
    base.getMonth() > birthMonth ||
    (base.getMonth() === birthMonth && base.getDate() >= birthDate);

  if (!hasBirthdayPassed) {
    age--;
  }

  return age;
};

const getAgeLabel = (
  birthDate: Date,
  startBaseDate?: Date,
  endBaseDate?: Date,
) => {
  const startAge = startBaseDate
    ? calcAge(birthDate, startBaseDate)
    : undefined;

  const endAge = endBaseDate ? calcAge(birthDate, endBaseDate) : undefined;

  if (startAge !== undefined && endAge !== undefined) {
    return startAge === endAge ? `${startAge}歳` : `${startAge}→${endAge}歳`;
  }

  if (startAge !== undefined) {
    return `${startAge}歳`;
  }

  if (endAge !== undefined) {
    return `${endAge}歳`;
  }

  return "";
};

const displayPositions = [
  {
    key: "GK",
    label: "ゴールキーパー",
    color: positionColorMap.GK,
    positions: ["GK"],
  },
  {
    key: "CB",
    label: "センターバック",
    color: positionColorMap.CB,
    positions: ["CB", "RCB", "LCB"],
  },
  {
    key: "SB",
    label: "サイドバック",
    color: positionColorMap.SB,
    positions: ["RSB", "LSB"],
  },
  {
    key: "WB",
    label: "ウイングバック",
    color: positionColorMap.WB,
    positions: ["RWB", "LWB"],
  },
  {
    key: "CM",
    label: "ボランチ",
    color: positionColorMap.CM,
    positions: ["RCM", "LCM", "DM"],
  },
  {
    key: "OM",
    label: "トップ下",
    color: positionColorMap.OM,
    positions: ["OM", "RST", "LST", "RIH", "LIH"],
  },
  {
    key: "WG",
    label: "ウイング",
    color: positionColorMap.WG,
    positions: ["RSH", "LSH", "RWG", "LWG"],
  },
  {
    key: "CF",
    label: "センターフォワード",
    color: positionColorMap.CF,
    positions: ["RCF", "LCF", "CF"],
  },
];

const positionOptions: string[] = displayPositions.map((d) => d.key);

type GroupedPlayers = {
  key: string;
  label: string;
  color?: string;
  positions?: string[];
  players: PlayerStatistic[];
};

const Matrix = ({
  playerStatistics,
  nationalCallUp,
  nationalMatchSeries,
  playerAppearance,
}: MatrixParams) => {
  const { filterConditions } = useFilter();

  const { startBaseDate, endBaseDate } = useMemo(() => {
    let startBaseDate: Date | undefined;
    let endBaseDate: Date | undefined;

    filterConditions?.forEach((filterCondition) => {
      if (filterCondition.key === "joined_at" && filterCondition.value) {
        const value = filterCondition.value[0];

        if (typeof value !== "boolean") {
          startBaseDate = new Date(value);
        }
      }

      if (filterCondition.key === "left_at" && filterCondition.value) {
        const value = filterCondition.value[0];

        if (typeof value !== "boolean") {
          endBaseDate = new Date(value);
        }
      }
    });

    return {
      startBaseDate,
      endBaseDate,
    };
  }, [filterConditions]);

  const [openPositions, setOpenPositions] = useState<Set<string>>(
    new Set([...positionOptions, "no-pos"]),
  );

  const togglePosition = (key: string) => {
    setOpenPositions((prev) => {
      const next = new Set(prev);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  };

  const { groupedPlayers, seriesList, matrix } = useMemo(() => {
    // 選手一覧（重複除去）
    const uniquePlayerStatistics = Array.from(
      new Map(playerStatistics.map((v) => [v.player._id, v])).values(),
    );

    const hasPositionPlayers: GroupedPlayers[] = displayPositions.map(
      (group) => ({
        ...group,
        players: uniquePlayerStatistics
          .filter(
            (p) => p.mainPosition && group.positions.includes(p.mainPosition),
          )
          .sort((a, b) => sortDob(a, b)),
      }),
    );

    const noPositionPlayers: GroupedPlayers[] = [
      {
        key: "no-pos",
        label: "データなし",
        players: uniquePlayerStatistics
          .filter((p) => !p.mainPosition)
          .sort((a, b) => sortDob(a, b)),
      },
    ];

    const groupedPlayers = [...hasPositionPlayers, ...noPositionPlayers].filter(
      (group) => group.players.length > 0,
    );

    // series一覧
    const seriesList = [
      ...nationalMatchSeries.sort((a, b) => {
        if (!a.joined_at && !b.joined_at) return 0;
        if (!a.joined_at) return 1;
        if (!b.joined_at) return -1;

        return (
          new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime()
        );
      }),
    ];

    // seriesId -> Match[]
    const seriesToMatches = new Map<string, MatchGet[]>();

    seriesList.forEach((series) => {
      seriesToMatches.set(
        series._id,
        (series.matches ?? []).map((m) => convert(ModelType.MATCH, m)),
      );
    });

    // playerId-matchId -> PlayerAppearance
    const appearanceMap = new Map<string, PlayerAppearanceGet>();

    playerAppearance.forEach((appearance) => {
      if (!appearance.match.id) return;

      appearanceMap.set(
        `${appearance.player.id}-${appearance.match.id}`,
        appearance,
      );
    });

    // playerId-seriesId -> Matrix
    const matrix = new Map<
      string,
      {
        appearances: CallUpInfo[];
      }
    >();

    nationalCallUp.forEach((callUp) => {
      const key = `${callUp.player._id}-${callUp.series._id}`;

      const matches = seriesToMatches.get(callUp.series._id) ?? [];

      let title = "招集";
      if (callUp.is_backup) {
        title = "バックアップ";
      }

      if (callUp.is_training_partner) {
        title = "トレーニングパートナー";
      }

      const appearances: CallUpInfo[] =
        matches.length === 0
          ? [
              {
                toolTipTitle: title,
                is_backup: callUp.is_backup,
                is_training_partner: callUp.is_training_partner,
                calledUp: true,
              },
            ]
          : matches.map((match) => {
              const playerAppearance = appearanceMap.get(
                `${callUp.player._id}-${match._id}`,
              );

              let calledUp: boolean = false;
              if (match.date) {
                const matchDate = new Date(match.date).getTime();

                const joined =
                  !callUp.joined_at ||
                  matchDate >= new Date(callUp.joined_at).getTime();

                const left =
                  !callUp.left_at ||
                  matchDate <= new Date(callUp.left_at).getTime();

                calledUp = joined && left;
              }

              let title = "";

              if (playerAppearance) {
                const { time, play_status, position } = playerAppearance;

                if (play_status === "サブ") {
                  title = `途中 - ${time}分`;
                } else if (play_status === "スタメン") {
                  title = `先発 - ${position} - ${time}分`;
                } else if (play_status === "ベンチ") {
                  title = "ベンチ";
                }
              } else {
                title = "ベンチ外";
              }

              if (!calledUp) {
                title = "招集外";
              }

              return {
                is_backup: callUp.is_backup,
                is_training_partner: callUp.is_training_partner,
                matchId: match._id,
                match,
                toolTipTitle: title,
                calledUp,
                playerAppearance,
              };
            });

      matrix.set(key, {
        appearances,
      });
    });

    return {
      groupedPlayers,
      seriesList,
      matrix,
    };
  }, [nationalCallUp, nationalMatchSeries, playerAppearance]);

  return (
    <div className="max-h-[80vh] max-w-full overflow-auto rounded-md border border-gray-300">
      <table className="border-collapse">
        <thead>
          <tr>
            <th
              className="
                sticky top-0 left-0 z-40
                min-w-[180px] whitespace-nowrap
                border border-gray-300
                bg-white
                px-3 py-1
              "
            >
              <div>選手</div>

              {(startBaseDate || endBaseDate) && (
                <div className="text-xs font-normal text-gray-500">
                  {startBaseDate && `${toDateKey(startBaseDate)}時点`}
                  {startBaseDate && endBaseDate && " → "}
                  {endBaseDate && `${toDateKey(endBaseDate)}時点`}
                </div>
              )}
            </th>

            {seriesList.map((series) => (
              <th
                key={series._id}
                className="
                  sticky top-0 z-30
                  min-w-[80px]
                  border border-gray-300
                  bg-white
                  p-1
                "
              >
                <Link
                  to={`${APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY}/${series._id}`}
                  className="underline hover:text-blue-600"
                >
                  {series.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groupedPlayers.map((group) => (
            <React.Fragment key={group.key}>
              <tr>
                <td
                  className="
                    sticky left-0 z-20
                    min-w-[140px]
                    border border-gray-300
                    bg-gray-100
                    px-5 py-1.5
                    font-bold
                    whitespace-nowrap
                    hover:cursor-pointer
                  "
                  onClick={() => togglePosition(group.key)}
                >
                  <span className="mr-2">
                    {openPositions.has(group.key) ? "▼" : "▶"}
                  </span>
                  {group.label} ({group.players.length})
                </td>

                {seriesList.map((series) => (
                  <td
                    key={series._id}
                    className="border-y border-gray-300 bg-gray-100"
                  />
                ))}
              </tr>

              {openPositions.has(group.key) &&
                group.players.map((player, index) => (
                  <tr key={player.player._id}>
                    <td
                      className={`
                      sticky left-0 z-10
                      min-w-[140px] whitespace-nowrap
                      border border-gray-300
                      px-5 py-0.5
                      font-semibold
                      ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    `}
                    >
                      <Link
                        to={`${APP_ROUTES.PLAYER_SUMMARY}/${player.player._id}`}
                        className="underline hover:text-blue-600"
                      >
                        {player.player.name}
                      </Link>
                      <span className="ml-1 text-sm text-gray-500">
                        {player.player.dob &&
                          getAgeLabel(
                            new Date(player.player.dob),
                            startBaseDate,
                            endBaseDate,
                          )}
                      </span>
                    </td>

                    {seriesList.map((series) => {
                      const value = matrix.get(
                        `${player.player._id}-${series._id}`,
                      ) ?? {
                        appearances: [],
                      };

                      return (
                        <td
                          key={series._id}
                          className={`border border-gray-300 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                        >
                          <div className="flex flex-wrap justify-center gap-1">
                            {value.appearances.map((appearance, i) => (
                              <Tooltip
                                key={i}
                                title={appearance.toolTipTitle}
                                arrow
                              >
                                <span>
                                  <CallUpCircle appearance={appearance} />
                                </span>
                              </Tooltip>
                            ))}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Matrix;

type CallUpInfo = {
  is_backup: boolean;
  is_training_partner: boolean;
  calledUp: boolean;
  toolTipTitle: string;
  match?: MatchGet;
  playerAppearance?: PlayerAppearanceGet;
};

type CallUpCircleProps = Omit<CallUpInfo, "toolTipTitle">;

const COLORS = {
  border: "#d1d5db", // gray-300
  bench: "#9ca3af",
  starter: "#2563eb", // blue-600
  substitute: "#f472b6", // pink-500
};

const SIZE = {
  circle: 20,
  square: 16,
};

const circleStyle = {
  width: SIZE.circle,
  height: SIZE.circle,
  borderRadius: "50%",
  border: `2px solid ${COLORS.border}`,
};

type CallupCircleParams = {
  appearance: CallUpCircleProps;
};

const CallUpCircle = ({ appearance }: CallupCircleParams) => {
  const { is_backup, is_training_partner, calledUp, match, playerAppearance } =
    appearance;
  // 招集外
  if (!calledUp) {
    return (
      <div
        style={{
          width: SIZE.circle,
          height: SIZE.circle,
        }}
      />
    );
  }

  // バックアップ
  if (is_backup) {
    return (
      <div
        style={{
          ...circleStyle,
          transform: "rotate(45deg)",
          background: "white",
        }}
      />
    );
  }

  // トレーニングパートナー
  if (is_training_partner) {
    return (
      <div
        style={{
          width: SIZE.square,
          height: SIZE.square,
          border: `2px solid ${COLORS.border}`,
          background: "white",
        }}
      />
    );
  }

  // 招集のみ（試合登録なし）
  if (!playerAppearance || !match) {
    return (
      <div
        style={{
          ...circleStyle,
          background: "white",
        }}
      />
    );
  }

  // ベンチ
  if (playerAppearance.play_status === "ベンチ") {
    return (
      <div
        style={{
          ...circleStyle,
          background: `${COLORS.bench}`,
        }}
      />
    );
  }

  // 出場
  const { time, play_status } = playerAppearance;
  const { play_time } = match;

  const ratio = time ? Math.min(time / (play_time ?? 90), 1) : 0;
  const color = play_status === "サブ" ? COLORS.substitute : COLORS.starter;

  return (
    <div
      style={{
        ...circleStyle,
        background: `conic-gradient(
      ${color} ${ratio * 360}deg,
      white 0deg
    )`,
      }}
    />
  );
};
