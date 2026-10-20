import { Link } from "react-router-dom";
import { useMemo } from "react";
import { Label } from "@dai0413/myorg-shared";
import { APP_ROUTES } from "../../../../../../lib/appRoutes";
import { MatchGet } from "../../../../../../types/models/match";
import { PlayerRegistrationGet } from "../../../../../../types/models/player-registration";
import { PlayerAppearanceGet } from "../../../../../../types/models/player-appearance";
import { GroupedPlayers } from "../type";
import { MatrixTable } from "./MatrixTable";
import { TransferGet } from "../../../../../../types/models/transfer";

type BirthYearPositionMatrixParams = {
  teamId: string;
  topHeaderText?: string;
  playerRegistrations: PlayerRegistrationGet[];
  matches: MatchGet[];
  playerAppearance: PlayerAppearanceGet[];
  defaultOpenPositions: Set<string>;
  groupedPlayers: GroupedPlayers[];
  transferIns: TransferGet[];
  transferOuts: TransferGet[];
  baseDate?: Date;
};

type Dates = {
  start: Date;
  end: Date;
  label: string;
};

const BirthYearPositionMatrix = ({
  groupedPlayers,
  playerRegistrations,
  transferIns,
  transferOuts,
  baseDate,
}: BirthYearPositionMatrixParams) => {
  if (!baseDate) return;

  const columns = useMemo<Label[]>(
    () =>
      groupedPlayers.map((groupedPlayer) => {
        return { label: groupedPlayer.key };
      }),
    [groupedPlayers],
  );

  const dates: Dates[] = Array.from({ length: 19 }, (_, i) => {
    const age = 35 - i;

    const end = new Date(baseDate);
    end.setFullYear(baseDate.getFullYear() - age);

    const start = new Date(baseDate);
    start.setFullYear(baseDate.getFullYear() - (age + 1));
    start.setDate(start.getDate() + 1);

    return {
      start,
      end,
      label: `${age}歳`,
    };
  });

  return (
    <MatrixTable
      columns={columns}
      dates={dates}
      renderHeader={(column) => column.label}
      renderCell={(date, column) => {
        const positionPlayers = groupedPlayers.find(
          (v) => v.key === column.label,
        )?.players;

        if (!positionPlayers) return <></>;

        const datePlayers = positionPlayers
          .filter((p) => {
            if (!p.player.dob) return false;

            const dob = new Date(p.player.dob);

            if (date.label === dates[0].label) {
              return dob <= date.end;
            }

            if (date.label === dates[dates.length - 1].label) {
              return dob >= date.start;
            }

            return dob >= date.start && dob <= date.end;
          })
          .sort(
            (a, b) =>
              new Date(a.player.dob!).getTime() -
              new Date(b.player.dob!).getTime(),
          );

        return (
          <div>
            {datePlayers.map((player) => {
              const playerName = player.player.name.replace(/\s/g, "");

              const reg = playerRegistrations.find(
                (p) =>
                  p.player.id === player.player._id &&
                  p.registration_type === "登録",
              );

              const isTypeTwo = reg?.isTypeTwo;
              const isSpecialDesignation = reg?.isSpecialDesignation;

              const outTransfer = transferOuts.find(
                (p) => p.player.id === player.player._id,
              );

              const inTransfer = transferIns.find(
                (p) => p.player.id === player.player._id,
              );

              return (
                <Link
                  key={player.player._id}
                  to={`${APP_ROUTES.PLAYER_SUMMARY}/${player.player._id}`}
                  className={`
                    relative
                    flex min-h-7 w-23 items-center justify-center
                    rounded-lg transition border-1
                    text-center text-sm font-medium
                    transition-colors underline
                    hover:text-blue-600
                    ${outTransfer && !inTransfer ? "text-gray-400" : "text-gray-800"}
                  `}
                  title={`${column.label}-${date.label}-${playerName}`}
                >
                  <span className="truncate">{playerName}</span>

                  {/* 右上：2種・特指 */}
                  {(isTypeTwo || isSpecialDesignation) && (
                    <span
                      className="
                          absolute -right-1 -top-1
                          rounded bg-blue-100
                          px-1 text-[9px] leading-3
                          font-semibold text-blue-700
                          no-underline
                        "
                    >
                      {isTypeTwo ? "2種" : "特指"}
                    </span>
                  )}

                  {/* 左上：加入・退団 */}
                  {(inTransfer || outTransfer) && (
                    <span
                      className={`
                          absolute -left-1 -top-1
                          rounded px-1
                          text-[9px] leading-3
                          font-semibold no-underline
                        ${
                          inTransfer
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      `}
                    >
                      {inTransfer ? inTransfer.form : outTransfer?.form}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        );
      }}
    />
  );
};

export default BirthYearPositionMatrix;
