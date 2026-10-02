import { TableClient } from "../../../../../components/dataView";
import {
  isFilterable,
  isSortable,
  UIFieldDefinition,
} from "../../../../../types/field";
import { UseNationalTeamSummary } from "../types";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { ColumnType, QuickFilterItem } from "../../../../../types/table";
import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { ViewMode } from "../../../../../types/types";
import { useMemo } from "react";
import { quickFilterItems } from "../constants/quickFilterItems";

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

  // const quickFilterItems: QuickFilterItem[] = useMemo(() => {
  //   return items.formationCounts.map((formation, index) => {
  //     return {
  //       key: formation.name,
  //       label: `${formation.name} (${formation.count})`,
  //       defaultSelect: index === 0,
  //       filterCondition: [
  //         {
  //           key: "formation",
  //           label: "フォーメーション",
  //           type: "select",
  //           filterable: true,
  //           value: [formation.name],
  //           valueLabel: [`${formation.name} (${formation.count})`],
  //           operator: "equals",
  //         },
  //       ],
  //     };
  //   });
  // }, [items.formationCounts]);

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
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
        quickFilterItems={quickFilterItems}
      />
    </>
  );
};

export default FormationPlotPanel;
