import { Link } from "react-router-dom";
import { useMemo } from "react";
import { Label } from "@dai0413/myorg-shared";
import {
  isRegisteredAtMatch,
  createRegistrationMap,
  createMatchLabel,
} from "./utils";
import { createAppearanceMap, getTitle } from "../utils";
import { MatrixTable } from "../MatrixTable";
import { APP_ROUTES } from "../../../../../../lib/appRoutes";
import { MatchGet } from "../../../../../../types/models/match";
import { PlayerRegistrationHistoryGet } from "../../../../../../types/models/player-registration-history";
import { PlayerAppearanceGet } from "../../../../../../types/models/player-appearance";
import MatrixCell from "../MatrixCell/MarixCell";
import { GroupedPlayers } from "../type";
import { InjuryGet } from "../../../../../../types/models/injury";
import { createInjuryMap } from "./utils/createInjuryMap";

type MatchColumn = Label & {
  match: MatchGet;
};

type MatchMatrixParams = {
  teamId: string;
  topHeaderText?: string;
  playerRegistrations: PlayerRegistrationHistoryGet[];
  matches: MatchGet[];
  playerAppearance: PlayerAppearanceGet[];
  defaultOpenPositions: Set<string>;
  groupedPlayers: GroupedPlayers[];
  injuries: InjuryGet[];
};

const MatchMatrix = ({
  teamId,
  topHeaderText,
  playerRegistrations,
  matches,
  playerAppearance,
  defaultOpenPositions,
  groupedPlayers,
  injuries,
}: MatchMatrixParams) => {
  const appearanceMap = useMemo(
    () => createAppearanceMap(playerAppearance),
    [playerAppearance],
  );

  const registrationMap = useMemo(
    () => createRegistrationMap(playerRegistrations),
    [playerRegistrations],
  );

  const injuryMap = useMemo(() => createInjuryMap(injuries), [injuries]);

  const columns = useMemo<MatchColumn[]>(
    () =>
      [...matches]
        .sort((a, b) => {
          if (!a.date && !b.date) return 0;
          if (!a.date) return 1;
          if (!b.date) return -1;

          return a.date.getTime() - b.date.getTime();
        })
        .map((match) => ({
          id: match._id,
          label: createMatchLabel(match, teamId),
          match,
        })),
    [matches, teamId],
  );

  return (
    <MatrixTable
      columns={columns}
      topHeaderText={topHeaderText}
      defaultOpenPositions={defaultOpenPositions}
      groupedPlayers={groupedPlayers}
      renderBeforeBody={(column) => {
        const date = column.match.date;
        if (!date) return "";

        return `${date.getFullYear()}\n${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
      }}
      renderHeader={(column) => (
        <Link
          to={`${APP_ROUTES.MATCH_SUMMARY}/${column.id}`}
          className="underline hover:text-blue-600"
        >
          {column.label}
        </Link>
      )}
      renderCell={(position, player, column) => {
        const match = column.match;

        const playerAppearances = appearanceMap.get(`${player.player._id}`);

        // 対象試合の出場情報
        const appearance = playerAppearances?.get(`${match._id}`);

        const registrations = registrationMap.get(
          `${player.player._id}-${match.competition.id}`,
        );

        // 選手の負傷情報
        const injuryDatas = injuryMap.get(`${player.player._id}`);

        if (player.player.name === "安西　幸輝") {
          console.log("injureyDatas", injuryMap, injuryDatas);
        }

        // 試合日以前に負傷しており、出場記録がない
        const injured: boolean = !!injuryDatas?.some((injury) => {
          const dates = [
            injury.doa?.getTime(),
            injury.doi?.getTime(),
            injury.dos?.getTime(),
          ].filter((date): date is number => date !== undefined);

          if (!dates.length || !match.date) return false;

          const injuryDateTime = Math.min(...dates);
          const matchDateTime = match.date.getTime();

          // 負傷開始から1.5年後
          const limitDate = new Date(injuryDateTime);
          limitDate.setMonth(limitDate.getMonth() + 18);

          // 負傷終了日（erd または1.5年後）
          const endDateTime = Math.min(
            injury.erd?.getTime() ?? Infinity,
            limitDate.getTime(),
          );

          // 負傷開始前、または負傷期間終了後
          if (injuryDateTime > matchDateTime || endDateTime < matchDateTime) {
            return false;
          }

          // 負傷後、対象試合より前に出場していれば復帰済み
          const returned = [...(playerAppearances?.values() ?? [])].some(
            (a) => {
              const appearanceDate = matches
                .find((match) => match._id === a.match.id)
                ?.date?.getTime();

              return (
                appearanceDate !== undefined &&
                appearanceDate > injuryDateTime &&
                appearanceDate < matchDateTime
              );
            },
          );

          return !returned && !appearance;
        });

        // これに加えて復帰情報がないか(負傷情報後に出場記録がないか)も確認したい
        // つまり 負傷情報から次の出場情報またはerdまたは1.5年後の間はinjured : trueとしたい

        const onRegister = isRegisteredAtMatch(teamId, registrations, match);

        const title = getTitle({
          appearance: appearance,
          onRegister: onRegister,
        });

        return (
          <MatrixCell
            appearances={[
              {
                bgYellow: appearance?.position === position,
                match: column.match,
                playerAppearance: appearance,
                calledUp: onRegister,
                is_backup: false,
                is_training_partner: false,
                toolTipTitle: title,
                injured: injured,
              },
            ]}
          />
        );
      }}
    />
  );
};

export default MatchMatrix;
