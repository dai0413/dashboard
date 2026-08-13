import { Link } from "react-router-dom";
import { useMemo } from "react";
import { Label } from "@dai0413/myorg-shared";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import {
  getGroupedPositions,
  isRegisteredAtMatch,
  createRegistrationMap,
  createMatchLabel,
} from "./utils";
import { displayPositions } from "../context/displayPositions";
import { createAppearanceMap, createGroupedPlayers, getTitle } from "../utils";
import { MatrixCell } from "../MatrixCell";
import { MatrixTable } from "../MatrixTable";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { MatchGet } from "../../../../types/models/match";
import { PlayerRegistrationHistoryGet } from "../../../../types/models/player-registration-history";
import { PlayerAppearanceGet } from "../../../../types/models/player-appearance";
import { FormationCounts } from "../../../../pages/Summary/Team/ClubTeam/types";

type MatchColumn = Label & {
  match: MatchGet;
};

type MatchMatrixParams = {
  teamId: string;
  playerStatistics: PlayerStatistic[];
  playerRegistrations: PlayerRegistrationHistoryGet[];
  matches: MatchGet[];
  playerAppearance: PlayerAppearanceGet[];
  formationCounts: FormationCounts[];
};

const MatchMatrix = ({
  teamId,
  playerStatistics,
  playerRegistrations,
  matches,
  playerAppearance,
  formationCounts,
}: MatchMatrixParams) => {
  const positionOptions = useMemo(() => {
    return getGroupedPositions(
      formationCounts && formationCounts.length > 0
        ? formationCounts[0].formation.position_formation
        : displayPositions.map((d) => d.key),
    );
  }, [formationCounts]);

  const groupedPlayers = useMemo(
    () => createGroupedPlayers(playerStatistics, positionOptions),
    [playerStatistics, positionOptions],
  );

  const appearanceMap = useMemo(
    () => createAppearanceMap(playerAppearance),
    [playerAppearance],
  );

  const registrationMap = useMemo(
    () => createRegistrationMap(playerRegistrations),
    [playerRegistrations],
  );

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
      groupedPlayers={groupedPlayers}
      columns={columns}
      positionOptions={positionOptions}
      renderHeader={(column) => (
        <Link
          to={`${APP_ROUTES.MATCH_SUMMARY}/${column.id}`}
          className="underline hover:text-blue-600"
        >
          {column.label}
        </Link>
      )}
      renderCell={(player, column) => {
        const match = column.match;

        const appearance = appearanceMap.get(
          `${player.player._id}-${match._id}`,
        );

        const registrations = registrationMap.get(
          `${player.player._id}-${match.competition.id}`,
        );

        const onRegister = isRegisteredAtMatch(registrations, match);

        const title = getTitle(appearance, onRegister, true);

        return (
          <MatrixCell
            appearances={[
              {
                match: column.match,
                playerAppearance: appearance,
                calledUp: true,
                is_backup: false,
                is_training_partner: false,
                toolTipTitle: title,
              },
            ]}
          />
        );
      }}
    />
  );
};

export default MatchMatrix;
