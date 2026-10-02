import { DataViewContainer } from "../../../../../components/dataView";
import {
  isFilterable,
  isSortable,
  UIFieldDefinition,
} from "../../../../../types/field";
import { UseNationalTeamSummary } from "../types";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { ColumnType } from "../../../../../types/table";
import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { ViewMode } from "../../../../../types/types";

const fieldDefinitions: UIFieldDefinition<PlayerStatistic>[] = [
  {
    key: "formation",
    filterKey: "formation",
    label: "フォーメーション",
    type: "select",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    displayOnTable: true,
    getValueType: ColumnType.CUSTOM,
    getData: (d) => ({
      label: toDateKey(d.player.dob) || "",
    }),
    width: "80px",
  },
];

const FormationPlotPanel = ({
  summary,
}: {
  summary: UseNationalTeamSummary;
}) => {
  const {
    id,
    panels: {
      formationPlot: { text, key, items, isLoading, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <DataViewContainer
        key={key}
        itemsLoading={isLoading}
        fieldDefinitions={fieldDefinitions}
        defaultViewMode={ViewMode.POSITION_LIST}
        viewModes={[ViewMode.POSITION_LIST]}
        viewData={{
          [ViewMode.POSITION_LIST]: items.groupedPlayers,
        }}
        totalCount={items.groupedPlayers.length}
        reloadFun={reloadFun}
        filterField={fieldDefinitions?.filter(isFilterable)}
        sortField={fieldDefinitions?.filter(isSortable)}
        initialData={{ formData: { team: id } }}
        quickFilterItems={items.quickFilterDatas}
      />
    </>
  );
};

export default FormationPlotPanel;
