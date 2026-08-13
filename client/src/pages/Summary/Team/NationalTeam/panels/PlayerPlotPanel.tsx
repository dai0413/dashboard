import { isFilterable, UIFieldDefinition } from "../../../../../types/field";
import { UseNationalTeamSummary } from "../types";
import { CustomTableContainer } from "../../../../../components/table";
import { SeriesMatrix } from "../../../../../components/table/Matrix";
import { ColumnType, QuickFilterItem } from "../../../../../types/table";
import { NationalMatchSeriesGet } from "../../../../../types/models/national-match-series";

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

const quickFilterItem: QuickFilterItem[] = [
  {
    key: "jpn-ger",
    label: "2002-2006",
    filterCondition: [
      {
        key: "joined_at",
        label: "活動開始日",
        type: "Date",
        filterable: true,
        value: ["2002/5/1"],
        valueLabel: ["2002/5/1"],
        operator: "gte",
      },
      {
        key: "left_at",
        label: "解散日",
        type: "Date",
        filterable: true,
        value: ["2006/7/1"],
        valueLabel: ["2006/7/1"],
        operator: "lte",
      },
    ],
  },
  {
    key: "ger-zaf",
    label: "2006-2010",
    filterCondition: [
      {
        key: "joined_at",
        label: "活動開始日",
        type: "Date",
        filterable: true,
        value: ["2006/5/1"],
        valueLabel: ["2006/5/1"],
        operator: "gte",
      },
      {
        key: "left_at",
        label: "解散日",
        type: "Date",
        filterable: true,
        value: ["2010/7/1"],
        valueLabel: ["2010/7/1"],
        operator: "lte",
      },
    ],
  },
  {
    key: "zaf-bra",
    label: "2010-2014",
    filterCondition: [
      {
        key: "joined_at",
        label: "活動開始日",
        type: "Date",
        filterable: true,
        value: ["2010/05/01"],
        valueLabel: ["2010/05/01"],
        operator: "gte",
      },
      {
        key: "left_at",
        label: "解散日",
        type: "Date",
        filterable: true,
        value: ["2014/07/01"],
        valueLabel: ["2014/07/01"],
        operator: "lte",
      },
    ],
  },
  {
    key: "bra-rus",
    label: "2014-2018",
    filterCondition: [
      {
        key: "joined_at",
        label: "活動開始日",
        type: "Date",
        filterable: true,
        value: ["2014/05/01"],
        valueLabel: ["2014/05/01"],
        operator: "gte",
      },
      {
        key: "left_at",
        label: "解散日",
        type: "Date",
        filterable: true,
        value: ["2018/08/01"],
        valueLabel: ["2018/08/01"],
        operator: "lte",
      },
    ],
  },
  {
    key: "rus-qat",
    label: "2018-2022",
    filterCondition: [
      {
        key: "joined_at",
        label: "活動開始日",
        type: "Date",
        filterable: true,
        value: ["2018/06/01"],
        valueLabel: ["2018/06/01"],
        operator: "gte",
      },
      {
        key: "left_at",
        label: "解散日",
        type: "Date",
        filterable: true,
        value: ["2022/12/31"],
        valueLabel: ["2022/12/31"],
        operator: "lte",
      },
    ],
  },
  {
    key: "qat-usa",
    label: "2022-2026",
    filterCondition: [
      {
        key: "joined_at",
        label: "活動開始日",
        type: "Date",
        filterable: true,
        value: ["2022/11/01"],
        valueLabel: ["2022/11/01"],
        operator: "gte",
      },
      {
        key: "left_at",
        label: "解散日",
        type: "Date",
        filterable: true,
        value: ["2026/7/30"],
        valueLabel: ["2026/7/30"],
        operator: "lte",
      },
    ],
    defaultSelect: true,
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
      <CustomTableContainer
        fieldDefinitions={[]}
        pageNum={1}
        items={items.nationalCallUp}
        filterField={filedDefinitions?.filter(isFilterable)}
        sortField={[]}
        reloadFun={async (filterConditions, sortConditions) =>
          await reloadFun(filterConditions, sortConditions)
        }
        handleFilterSort={async (filterConditions, sortConditions) => {
          await reloadFun(filterConditions, sortConditions);
        }}
        renderView={({ filterConditions, sortConditions }) => (
          <SeriesMatrix
            filterConditions={filterConditions}
            sortConditions={sortConditions}
            playerStatistics={items.playerStatistics}
            nationalCallUp={items.nationalCallUp}
            nationalMatchSeries={items.nationalMatchSeries}
            playerAppearance={items.playerAppearance}
          />
        )}
        quickFilterItems={quickFilterItem}
        itemsLoading={isLoading}
      />
    </>
  );
};

export default PlayerPlotPanel;
