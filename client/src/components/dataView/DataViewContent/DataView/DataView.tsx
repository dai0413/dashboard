import { useMemo } from "react";
import { useDataView } from "../../../../context/dataView-context";
import Tile from "./Tile";
import Table from "./Table";
import { TableData, TableHeader } from "../../../../types/table";
import { LinkField, ViewMode } from "../../../../types/types";
import { convertToDisplayListData } from "../../../modals/Detail/utils/convertToDisplayListData ";
import { useModal } from "../../../../context/modal-context";
import { hasId } from "../../../../utils/data/getIdKey";
import { ModelType } from "../../../../types/models";
import { CalendarTable } from "./Calendar/CalendarTable";
import { Formation } from "../../../formation";
import { RadarChart } from "../../../plot/RadarChart/RadarChart";
import { convertToRadarData } from "../../../../utils/data/convertToRadarData";
import { RadarField } from "../../../plot/RadarChart/types";
import { FormationItem } from "../../../../types/formation";
import { CalendarDataItem } from "./Calendar/types";
import { RadarValues } from "../../../../utils/plot/buildRadarPlotData";

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
  viewData: {
    [ViewMode.TABLE]?: TableData<T>;
    [ViewMode.TILE]?: TableData<T>;
    [ViewMode.RADAR_CHART]?: {
      data: RadarValues;
      fields: RadarField[];
      label: string;
    };
    [ViewMode.FORMATION]?: FormationItem[];
    [ViewMode.CALENDAR]?: {
      data: CalendarDataItem[];
      currentDate: Date;
      setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
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

      open(
        modelType,
        row._id,
        convertToDisplayListData({
          data: row,
          model: {
            modelType,
            linkField: linkField || [],
          },
        }),
      );
    };
  }, [modelType, linkField, open]);

  const visibleHeaders = useMemo(
    () => headers?.filter((h) => columnVisibility[h.key]),
    [headers, columnVisibility],
  );

  if (
    viewMode === ViewMode.TABLE &&
    visibleHeaders &&
    viewData[ViewMode.TABLE]
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

  if (viewMode === ViewMode.TILE && visibleHeaders && viewData[ViewMode.TILE]) {
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
    return (
      <div className="mx-5 flex justify-center">
        <Formation datas={viewData[ViewMode.FORMATION]} />
      </div>
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
};

export default DataView;
