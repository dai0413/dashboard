import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { nationalCallUp, nationalMatchSeries } from "./sample";
import { APP_ROUTES } from "../../../lib/appRoutes";
import { InputField } from "../../../components/field";

type CallUpCircleProps = {
  calledUp: boolean;
  minutes: number;
  matchPlayTime?: number;
  status?: "start" | "sub";
};

const COLORS = {
  border: "#d1d5db", // gray-300
  starter: "#2563eb", // blue-600
  substitute: "#f472b6", // pink-500
};

const CallUpCircle = ({
  calledUp,
  minutes,
  matchPlayTime,
  status,
}: CallUpCircleProps) => {
  if (!calledUp) return null;

  const ratio = Math.min(minutes / (matchPlayTime ?? 90), 1);
  const color = status === "sub" ? COLORS.substitute : COLORS.starter;

  return (
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        border: "2px solid #d1d5db",
        background: `conic-gradient(
      ${color} ${ratio * 360}deg,
      white 0deg
    )`,
      }}
    />
  );
};

const CallUp = () => {
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

    // playerId-seriesId => callUp情報
    const matrix = new Map<
      string,
      {
        calledUp: boolean;
        appearances: {
          matchId: string;
          minutes: number;
          status: "sub" | "start";
        }[];
      }
    >();

    const getMockMinutes = (playerId: string, seriesId: string) => {
      const seed = `${playerId}${seriesId}`;

      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        hash += seed.charCodeAt(i);
      }

      return hash % 120 > 90 ? 0 : hash % 91;
    };

    nationalCallUp.forEach((v) => {
      matrix.set(`${v.player._id}-${v.series._id}`, {
        calledUp: true,
        appearances: [
          {
            minutes: getMockMinutes(v.player._id, v.series._id),
            status: "start",
            matchId: "",
          },
          {
            minutes: getMockMinutes(v.player._id, v.series._id),
            status: "sub",
            matchId: "match2",
          },
        ],
      });
    });

    return {
      players,
      seriesList,
      matrix,
    };
  }, [nationalCallUp, nationalMatchSeries]);

  return (
    <div
      style={{
        maxHeight: "80vh",
        overflowX: "auto",
        maxWidth: "100%",
        border: "1px solid #ddd",
      }}
    >
      <div className="bg-white p-4">
        <Filter />
      </div>

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

              {seriesList.map((series) => {
                const value = matrix.get(`${player._id}-${series._id}`) ?? {
                  calledUp: false,
                  appearances: [],
                };

                return (
                  <td
                    key={series._id}
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
                      {value.appearances.map((appearance) => (
                        <Tooltip
                          title={`${series.name} - ${appearance.minutes}分出場`}
                          arrow
                        >
                          <span>
                            <CallUpCircle
                              calledUp={value.calledUp}
                              minutes={appearance.minutes}
                              status={appearance.status}
                            />
                          </span>
                        </Tooltip>
                      ))}
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

export default CallUp;

const Filter = () => {
  const competitionTypes = ["W杯", "W杯予選", "親善試合"];
  const selectedCompetitionTypes = "W杯";

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-semibold">期間</span>

        <div className="flex gap-2">
          <InputField type="date" value={""} onChange={() => {}} />

          <InputField type="date" value={""} onChange={() => {}} />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-semibold">大会種類</span>

        {competitionTypes.map((type) => (
          <button
            key={type}
            // onClick={() => toggleCompetitionType(type)}
            className={`
          px-3 py-1 rounded-full border text-sm hover:bg-green-50 hover:border-green-500 transition
          ${
            selectedCompetitionTypes.includes(type)
              ? "bg-green-600 text-white"
              : "bg-white text-gray-700"
          }`}
          >
            {type}
          </button>
        ))}
      </div>
    </>
  );
};
