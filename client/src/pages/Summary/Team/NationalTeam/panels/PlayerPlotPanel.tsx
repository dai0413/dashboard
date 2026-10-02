import { isFilterable, UIFieldDefinition } from "../../../../../types/field";
import { UseNationalTeamSummary } from "../types";
import { DataViewContainer } from "../../../../../components/dataView";
import { ColumnType } from "../../../../../types/table";
import { NationalMatchSeriesGet } from "../../../../../types/models/national-match-series";
import { ViewMode } from "../../../../../types/types";
import { quickFilterItems } from "../constants/quickFilterItems";

const filedDefinitions: UIFieldDefinition<NationalMatchSeriesGet>[] = [
  {
    key: "joined_at",
    field: "joined_at",
    label: "活動開始日",
    type: "Date",
    filterable: true,
    displayOnDetail: true,
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
  },
  {
    key: "left_at",
    field: "left_at",
    label: "解散日",
    type: "Date",
    filterable: true,
    displayOnDetail: true,
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
  },
];

const PlayerPlotPanel = ({ summary }: { summary: UseNationalTeamSummary }) => {
  const {
    panels: {
      playerPlot: { text, items, reloadFun, isLoading },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <DataViewContainer
        totalCount={items.nationalCallUp.length || 0}
        filterField={filedDefinitions?.filter(isFilterable)}
        sortField={[]}
        reloadFun={async (filterConditions, sortConditions) =>
          await reloadFun(filterConditions, sortConditions)
        }
        handleFilterSort={async (filterConditions, sortConditions) => {
          await reloadFun(filterConditions, sortConditions);
        }}
        quickFilterItems={[quickFilterItems]}
        itemsLoading={isLoading}
        viewModes={[ViewMode.SERIES_MATRIX]}
        defaultViewMode={ViewMode.SERIES_MATRIX}
        viewData={{
          [ViewMode.SERIES_MATRIX]: {
            playerStatistics: items.playerStatistics,
            nationalCallUp: items.nationalCallUp,
            nationalMatchSeries: items.nationalMatchSeries,
            playerAppearance: items.playerAppearance,
            formationCounts: items.formationCounts,
          },
        }}
      />
    </>
  );
};

export default PlayerPlotPanel;
