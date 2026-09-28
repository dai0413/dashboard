import { Link } from "react-router-dom";
import { useMemo } from "react";
import { Label } from "@dai0413/myorg-shared";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { MatrixTable } from "../MatrixTable";
import { createCallUpCircleInfo } from "./utils/createCallUpCircleInfo";
import { createAppearanceMap, getTitle } from "../utils";
import { APP_ROUTES } from "../../../../../../lib/appRoutes";
import { ModelType } from "../../../../../../types/models";
import { convert } from "../../../../../../lib/convert/DBtoGetted";
import { NationalCallup } from "../../../../../../types/models/national-callup";
import { PlayerAppearanceGet } from "../../../../../../types/models/player-appearance";
import { NationalMatchSeries } from "../../../../../../types/models/national-match-series";
import MatrixCell from "../MatrixCell/MarixCell";
import { FormationCounts } from "../../../../../../pages/Summary/Team/ClubTeam/types";

type SeriesMatrixParams = {
  playerStatistics: PlayerStatistic[];
  nationalCallUp: NationalCallup[];
  nationalMatchSeries: NationalMatchSeries[];
  playerAppearance: PlayerAppearanceGet[];
  formationCounts: FormationCounts[];
  startBaseDate?: Date;
  endBaseDate?: Date;
};

type SeriesColumn = Label & {
  series: NationalMatchSeries;
};

const SeriesMatrix = ({
  startBaseDate,
  endBaseDate,
  playerStatistics,
  nationalCallUp,
  nationalMatchSeries,
  playerAppearance,
  formationCounts,
}: SeriesMatrixParams) => {
  const appearanceMap = useMemo(
    () => createAppearanceMap(playerAppearance),
    [playerAppearance],
  );

  const callUpMap = useMemo(
    () =>
      new Map(
        nationalCallUp.map((callUp) => [
          `${callUp.player._id}-${callUp.series._id}`,
          callUp,
        ]),
      ),
    [nationalCallUp],
  );

  const seriesList = useMemo(
    () =>
      [...nationalMatchSeries].sort((a, b) => {
        if (!a.joined_at && !b.joined_at) return 0;
        if (!a.joined_at) return 1;
        if (!b.joined_at) return -1;

        return (
          new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime()
        );
      }),
    [nationalMatchSeries],
  );

  const columns = useMemo<SeriesColumn[]>(
    () =>
      seriesList.map((series) => ({
        id: series._id,
        label: series.name,
        series,
      })),
    [seriesList],
  );

  return (
    <MatrixTable
      formationCounts={formationCounts}
      playerStatistics={playerStatistics}
      columns={columns}
      renderHeader={(column) => (
        <Link
          to={`${APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY}/${column.series._id}`}
          className="underline hover:text-blue-600"
        >
          {column.series.name}
        </Link>
      )}
      startBaseDate={startBaseDate}
      endBaseDate={endBaseDate}
      renderCell={(player, column) => {
        const series = column.series;

        const callUp = callUpMap.get(`${player.player._id}-${series._id}`);

        const matches = (series.matches ?? []).map((match) =>
          convert(ModelType.MATCH, match),
        );

        if (!callUp) {
          return <MatrixCell appearances={[]} />;
        }

        if (matches.length === 0) {
          let title = "招集";

          if (callUp.is_backup) {
            title = getTitle(undefined, false, true, "バックアップ");
          }

          if (callUp.is_training_partner) {
            title = getTitle(undefined, false, true, "トレーニングパートナー");
          }

          return (
            <MatrixCell
              appearances={[
                {
                  toolTipTitle: title,
                  is_backup: callUp.is_backup,
                  is_training_partner: callUp.is_training_partner,
                  calledUp: true,
                },
              ]}
            />
          );
        }

        const appearances = matches
          .sort((a, b) => (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0))
          .map((match) => {
            return createCallUpCircleInfo({
              match,
              appearance: appearanceMap.get(
                `${player.player._id}-${match._id}`,
              ),
              nationalCallup: callUp,
            });
          });

        return <MatrixCell appearances={appearances} />;
      }}
    />
  );
};

export default SeriesMatrix;
