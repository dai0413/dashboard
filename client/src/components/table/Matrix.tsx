import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../lib/appRoutes";
import { Tooltip } from "@mui/material";
import { useMemo } from "react";
import { PlayerAppearanceGet } from "../../types/models/player-appearance";
import { MatchGet } from "../../types/models/match";
import { ModelType } from "../../types/models";
import { convert } from "../../lib/convert/DBtoGetted";
import { MatrixParams } from "../../types/table/matrix";

const Matrix = ({
  nationalCallUp,
  nationalMatchSeries,
  playerAppearance,
}: MatrixParams) => {
  const { players, seriesList, matrix } = useMemo(() => {
    // 選手一覧（重複除去）
    const uniquePlayers = Array.from(
      new Map(nationalCallUp.map((v) => [v.player._id, v.player])).values(),
    );
    const players = [
      ...uniquePlayers.sort((a, b) => {
        if (!a.dob && !b.dob) return 0;
        if (!a.dob) return 1;
        if (!b.dob) return -1;

        return new Date(a.dob).getTime() - new Date(b.dob).getTime();
      }),
    ];

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
      players,
      seriesList,
      matrix,
    };
  }, [nationalCallUp, nationalMatchSeries, playerAppearance]);

  return (
    <div
      style={{
        maxHeight: "80vh",
        overflowX: "auto",
        maxWidth: "100%",
        border: "1px solid #ddd",
      }}
    >
      <table
        style={{
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "2px 12px",
                position: "sticky",
                left: 0,
                top: 0,
                background: "#fff",
                zIndex: 4,

                minWidth: "140px",
                whiteSpace: "nowrap",
              }}
            >
              選手
            </th>

            {seriesList.map((series) => (
              <th
                key={series._id}
                style={{
                  border: "1px solid #ddd",
                  padding: "5px",
                  minWidth: "80px",
                  position: "sticky",
                  top: 0,
                  background: "#fff",
                  zIndex: 3,
                }}
              >
                <Link
                  to={`${APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY}/${series._id}`}
                  className="hover:text-blue-600 underline"
                >
                  {series.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {players.map((player, index) => (
            <tr
              key={player._id}
              style={{
                background: index % 2 === 0 ? "#fafafa" : "#fff",
              }}
            >
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "2px 12px",
                  position: "sticky",
                  left: 0,
                  background: index % 2 === 0 ? "#fafafa" : "#fff",
                  fontWeight: 600,

                  minWidth: "140px",
                  whiteSpace: "nowrap",
                  zIndex: 1,
                }}
              >
                <Link
                  to={`${APP_ROUTES.PLAYER_SUMMARY}/${player._id}`}
                  className="hover:text-blue-600 underline"
                >
                  {player.name}
                </Link>
              </td>

              {seriesList.map((series, i) => {
                const value = matrix.get(`${player._id}-${series._id}`) ?? {
                  appearances: [],
                };

                return (
                  <td
                    key={`${i}`}
                    style={{
                      border: "1px solid #ddd",
                      padding: "4px",
                      textAlign: "center",
                      width: "50px",
                      height: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 4,
                        flexWrap: "wrap",
                      }}
                    >
                      {value.appearances.map((appearance, i) => {
                        return (
                          <Tooltip
                            key={`${i}`}
                            title={appearance.toolTipTitle}
                            arrow
                          >
                            <span>
                              <CallUpCircle appearance={appearance} />
                            </span>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </td>
                );
              })}
            </tr>
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
