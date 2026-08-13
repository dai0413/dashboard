import { Link } from "react-router-dom";
import { useMemo } from "react";
import {
  FilterableFieldDefinition,
  Label,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { MatrixTable } from "../MatrixTable";
import { MatrixCell } from "../MatrixCell";
import { createCallUpCircleInfo } from "./utils/createCallUpCircleInfo";
import { createAppearanceMap, createGroupedPlayers, getTitle } from "../utils";
import { displayPositions } from "../context/displayPositions";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { ModelType } from "../../../../types/models";
import { convert } from "../../../../lib/convert/DBtoGetted";
import { NationalCallup } from "../../../../types/models/national-callup";
import { PlayerAppearanceGet } from "../../../../types/models/player-appearance";
import { NationalMatchSeries } from "../../../../types/models/national-match-series";

type SeriesMatrixParams = {
  playerStatistics: PlayerStatistic[];
  nationalCallUp: NationalCallup[];
  nationalMatchSeries: NationalMatchSeries[];
  playerAppearance: PlayerAppearanceGet[];
  filterConditions?: FilterableFieldDefinition[];
  sortConditions?: SortableFieldDefinition[];
};

type SeriesColumn = Label & {
  series: NationalMatchSeries;
};

const SeriesMatrix = ({
  filterConditions,
  playerStatistics,
  nationalCallUp,
  nationalMatchSeries,
  playerAppearance,
}: SeriesMatrixParams) => {
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

  const groupedPlayers = useMemo(
    () => createGroupedPlayers(playerStatistics, displayPositions),
    [playerStatistics],
  );

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
      groupedPlayers={groupedPlayers}
      columns={columns}
      positionOptions={displayPositions}
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

        const appearances = matches.map((match) => {
          return createCallUpCircleInfo({
            match,
            appearance: appearanceMap.get(`${player.player._id}-${match._id}`),
            nationalCallup: callUp,
          });
        });

        return <MatrixCell appearances={appearances} />;
      }}
    />
  );
};

export default SeriesMatrix;
