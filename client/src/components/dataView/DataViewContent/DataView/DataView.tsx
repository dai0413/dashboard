import { ReactNode, useMemo } from "react";
import { useDataView } from "../../../../context/dataView-context";
import Tile from "./Tile";
import Table from "./Table";
import { ColumnType, TableData, TableHeader } from "../../../../types/table";
import { LinkField, ViewMode } from "../../../../types/types";
import { convertToDisplayListData } from "../../../modals/Detail/utils/convertToDisplayListData ";
import { useModal } from "../../../../context/modal-context";
import { hasId } from "../../../../utils/data/getIdKey";
import { GettedModelDataMap, ModelType } from "../../../../types/models";
import { CalendarTable } from "./Calendar/CalendarTable";
import { Formation } from "../../../formation";
import { RadarChart } from "../../../plot/RadarChart/RadarChart";
import { convertToRadarData } from "../../../../utils/data/convertToRadarData";
import { RadarField } from "../../../plot/RadarChart/types";
import { FormationItem } from "../../../../types/formation";
import { CalendarDataItem } from "./Calendar/types";
import { RadarValues } from "../../../../utils/plot/buildRadarPlotData";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player";
import { MatchGet } from "../../../../types/models/match";
import { FormationCounts } from "../../../../pages/Summary/Team/ClubTeam/types";
import { PlayerAppearanceGet } from "../../../../types/models/player-appearance";
import { MatchMatrix, SeriesMatrix, BirthYearPositionMatrix } from "./Matrix";
import { NationalCallup } from "../../../../types/models/national-callup";
import { NationalMatchSeries } from "../../../../types/models/national-match-series";
import { PlayerRegistrationGet } from "../../../../types/models/player-registration";
import { PositionPlayers } from "../../../formation/PositionPlayers";
import { GroupedPlayers } from "./Matrix/type";
import { TransferGet } from "../../../../types/models/transfer";
import { MonthlyCalendarTable } from "./MonthlyCalendar/MonthlyCalendarTable";
import {
  MonthlyCalendarGroup,
  MonthleyCalendarHeaderItem,
} from "../../../../types/calendar";
import { ScatterPlot } from "../../../plot/Scatter";
import { radarFields } from "../../../plot/RadarChart/radarFields";

type DataViewProps<T> = {
  modelType?: ModelType;
  headers?: TableHeader<T>[];
  linkField?: LinkField[];
  form?: boolean;
  selectedKey?: string[];
  selectedKeys?: Record<number, string[]>;
  edit?: boolean;
  renderFieldCell?: (
    header: TableHeader<T>,
    row: T,
    rowIndex: number,
  ) => React.ReactNode;
  onActionClick?: (index: number, row: T) => void;
  onDeleteClick?: (index: number) => void;
  noItemMessage?: ReactNode;
  viewData: {
    [ViewMode.TABLE]?: TableData<T>;
    [ViewMode.TILE]?: TableData<T>;
    [ViewMode.MONTHLY_CALENDAR]?: {
      groups: MonthlyCalendarGroup[];
      selectedKey: string;
      headerItems: MonthleyCalendarHeaderItem[];
      headerOnChange: (key: string) => void;
    };
    [ViewMode.RADAR_CHART]?: {
      data: RadarValues;
      fields: RadarField[];
      label: string;
    };
    [ViewMode.FORMATION]?: FormationItem[];
    [ViewMode.POSITION_LIST]?: GroupedPlayers[];
    [ViewMode.CALENDAR]?: {
      data: CalendarDataItem[];
      currentDate: Date;
      setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
    };
    [ViewMode.MATCH_MATRIX]?: {
      teamId: string;
      playerRegistrations: PlayerRegistrationGet[];
      matches: MatchGet[];
      playerAppearance: PlayerAppearanceGet[];
      groupedPlayers: GroupedPlayers[];
      defaultOpenPositions: Set<string>;
      topHeaderText: string;
    };
    [ViewMode.SERIES_MATRIX]?: {
      playerStatistics: PlayerStatistic[];
      nationalCallUp: NationalCallup[];
      nationalMatchSeries: NationalMatchSeries[];
      playerAppearance: PlayerAppearanceGet[];
      formationCounts: FormationCounts[];
      groupedPlayers: GroupedPlayers[];
      defaultOpenPositions: Set<string>;
      topHeaderText: string;
    };
    [ViewMode.BIRTH_YEAR_POSITION_MATRIX]?: {
      teamId: string;
      playerRegistrations: PlayerRegistrationGet[];
      matches: MatchGet[];
      playerAppearance: PlayerAppearanceGet[];
      groupedPlayers: GroupedPlayers[];
      defaultOpenPositions: Set<string>;
      topHeaderText: string;
      transferIns: TransferGet[];
      transferOuts: TransferGet[];
      baseDate?: Date;
    };
    [ViewMode.SCATTER]?: {
      filterHeaders: (visibleHeaders: TableHeader<T>[]) => TableHeader<T>[];
      createLabel: (item: T) => string;
      createColor: ((item: T) => string | undefined) | undefined;
    };
  };
};

const DataView = <T,>({
  modelType,
  headers,
  linkField,
  form = false,
  selectedKey = [],
  selectedKeys,
  edit,
  renderFieldCell,
  onActionClick,
  onDeleteClick,
  viewData,
  noItemMessage,
}: DataViewProps<T>) => {
  const { viewMode, rowSpacing, columnVisibility } = useDataView();

  const {
    detail: { open },
  } = useModal();

  const onDetailClick = useMemo(() => {
    if (!modelType) {
      return undefined;
    }

    return (row: T) => {
      if (!hasId(row)) {
        return;
      }

      const data = convertToDisplayListData({
        data: row as unknown as GettedModelDataMap[typeof modelType],
        model: {
          modelType,
          linkField: linkField || [],
        },
      });

      open(modelType, row._id, data);
    };
  }, [modelType, linkField, open]);

  const visibleHeaders = useMemo(() => {
    if (!columnVisibility) return [];
    const val =
      headers
        ?.filter((h) => columnVisibility[h.key].display)
        .map((h) => ({ ...h, index: columnVisibility[h.key].index }))
        .sort((a, b) => {
          return a.index - b.index;
        })
        .map(({ index, ...field }) => field) || [];

    return val;
  }, [headers, columnVisibility]);

  if (
    viewMode === ViewMode.TABLE &&
    visibleHeaders &&
    viewData[ViewMode.TABLE] &&
    viewData[ViewMode.TABLE].length > 0
  ) {
    return (
      <Table
        datas={viewData[ViewMode.TABLE]}
        headers={visibleHeaders}
        linkField={linkField}
        rowSpacing={rowSpacing}
        form={form}
        selectedKey={selectedKey}
        selectedKeys={selectedKeys}
        edit={edit}
        renderFieldCell={renderFieldCell}
        onActionClick={onActionClick}
        onDetailClick={onDetailClick}
        onDeleteClick={onDeleteClick}
      />
    );
  }

  if (
    viewMode === ViewMode.TILE &&
    visibleHeaders &&
    viewData[ViewMode.TILE] &&
    viewData[ViewMode.TILE].length > 0
  ) {
    return (
      <div className="mx-5">
        <Tile
          datas={viewData[ViewMode.TILE]}
          headers={visibleHeaders}
          linkField={linkField}
          rowSpacing={rowSpacing}
          form={form}
          selectedKey={selectedKey}
          selectedKeys={selectedKeys}
          edit={edit}
          renderFieldCell={renderFieldCell}
          onActionClick={onActionClick}
          onDetailClick={onDetailClick}
          onDeleteClick={onDeleteClick}
        />
      </div>
    );
  }

  if (viewMode === ViewMode.RADAR_CHART && viewData[ViewMode.RADAR_CHART]) {
    const { label, fields, data } = viewData[ViewMode.RADAR_CHART];

    const radarDataFields = visibleHeaders
      ? visibleHeaders
          ?.map((header) => fields.find((field) => field.key === header.key))
          .filter((field): field is RadarField => field !== undefined)
      : [];

    const radarChartDatas = convertToRadarData(data, radarDataFields, label);

    if (!radarChartDatas) return <></>;

    return (
      <RadarChart
        labels={radarChartDatas.labels}
        datasets={radarChartDatas.datasets}
      />
    );
  }

  if (viewMode === ViewMode.FORMATION && viewData[ViewMode.FORMATION]) {
    return <Formation datas={viewData[ViewMode.FORMATION]} />;
  }

  if (viewMode === ViewMode.POSITION_LIST && viewData[ViewMode.POSITION_LIST]) {
    return (
      <PositionPlayers groupedPlayers={viewData[ViewMode.POSITION_LIST]} />
    );
  }

  if (viewMode === ViewMode.CALENDAR && viewData[ViewMode.CALENDAR]) {
    return (
      <CalendarTable
        data={viewData[ViewMode.CALENDAR].data}
        currentDate={viewData[ViewMode.CALENDAR].currentDate}
        setCurrentDate={viewData[ViewMode.CALENDAR].setCurrentDate}
      />
    );
  }

  if (viewMode === ViewMode.MATCH_MATRIX && viewData[ViewMode.MATCH_MATRIX]) {
    const {
      teamId,
      playerAppearance,
      playerRegistrations,
      matches,
      defaultOpenPositions,
      groupedPlayers,
      topHeaderText,
    } = viewData[ViewMode.MATCH_MATRIX];

    return (
      <MatchMatrix
        teamId={teamId}
        topHeaderText={topHeaderText}
        playerAppearance={playerAppearance}
        playerRegistrations={playerRegistrations}
        matches={matches}
        defaultOpenPositions={defaultOpenPositions}
        groupedPlayers={groupedPlayers}
      />
    );
  }

  if (viewMode === ViewMode.SERIES_MATRIX && viewData[ViewMode.SERIES_MATRIX]) {
    const {
      defaultOpenPositions,
      groupedPlayers,
      nationalCallUp,
      nationalMatchSeries,
      playerAppearance,
      topHeaderText,
    } = viewData[ViewMode.SERIES_MATRIX];

    return (
      <SeriesMatrix
        topHeaderText={topHeaderText}
        defaultOpenPositions={defaultOpenPositions}
        groupedPlayers={groupedPlayers}
        nationalCallUp={nationalCallUp}
        nationalMatchSeries={nationalMatchSeries}
        playerAppearance={playerAppearance}
      />
    );
  }

  if (
    viewMode === ViewMode.BIRTH_YEAR_POSITION_MATRIX &&
    viewData[ViewMode.BIRTH_YEAR_POSITION_MATRIX]
  ) {
    const {
      teamId,
      playerAppearance,
      playerRegistrations,
      matches,
      defaultOpenPositions,
      groupedPlayers,
      topHeaderText,
      transferOuts,
      transferIns,
      baseDate,
    } = viewData[ViewMode.BIRTH_YEAR_POSITION_MATRIX];

    return (
      <BirthYearPositionMatrix
        teamId={teamId}
        topHeaderText={topHeaderText}
        playerAppearance={playerAppearance}
        playerRegistrations={playerRegistrations}
        matches={matches}
        defaultOpenPositions={defaultOpenPositions}
        groupedPlayers={groupedPlayers}
        transferIns={transferIns}
        transferOuts={transferOuts}
        baseDate={baseDate}
      />
    );
  }

  if (
    viewMode === ViewMode.MONTHLY_CALENDAR &&
    viewData[ViewMode.MONTHLY_CALENDAR]
  ) {
    const { groups, headerItems, selectedKey, headerOnChange } =
      viewData[ViewMode.MONTHLY_CALENDAR];
    return (
      <MonthlyCalendarTable
        groups={groups}
        headerItems={headerItems}
        headerOnChange={headerOnChange}
        selectedKey={selectedKey}
      />
    );
  }

  if (viewMode === ViewMode.SCATTER && viewData[ViewMode.SCATTER]) {
    const { filterHeaders, createLabel, createColor } =
      viewData[ViewMode.SCATTER];

    const headers = filterHeaders(visibleHeaders);
    const [column, row] = headers;
    if (!column || !row) return null;

    const data = viewData[ViewMode.TABLE]?.flatMap((d) => {
      const x =
        column.getValueType === ColumnType.FIELD
          ? d.item[column.field]
          : column.getData(d.item);
      const y =
        row.getValueType === ColumnType.FIELD
          ? d.item[row.field]
          : row.getData(d.item);

      if (typeof x !== "number" || typeof y !== "number") {
        return [];
      }

      return [
        {
          x,
          y,
          label: createLabel(d.item),
          color: createColor ? createColor(d.item) : undefined,
        },
      ];
    });

    const columnHigherIsBetter =
      radarFields.find((f) => f.key === column.key)?.higherIsBetter ?? true;

    const rowHigherIsBetter =
      radarFields.find((f) => f.key === row.key)?.higherIsBetter ?? true;

    return (
      <ScatterPlot
        xLabel={column.label}
        yLabel={row.label}
        xReverse={!columnHigherIsBetter}
        yReverse={!rowHigherIsBetter}
        data={data ?? []}
      />
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-8 py-10 text-center">
        <p className="mb-2 text-lg font-semibold text-gray-600">
          表示するデータがありません
        </p>
        {noItemMessage}
      </div>
    </div>
  );
};

export default DataView;
