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
import { convertToCalendarData } from "./Calendar/data/convertToCalendarData";
import { Formation } from "../../../formation";
import { convertToFormationItem } from "../../../../utils/data/convertToFormationItem";

type DataViewProps<T> = {
  modelType?: ModelType;
  datas: TableData<T>;
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
  viewOptions?: {
    calendar?: {
      currentDate: Date;
      setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
    };
  };
};

const DataView = <T,>({
  modelType,
  datas,
  headers,
  linkField,
  form = false,
  selectedKey = [],
  selectedKeys,
  edit,
  renderFieldCell,
  onActionClick,
  onDeleteClick,
  viewOptions,
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

  if (viewMode === ViewMode.TABLE && visibleHeaders) {
    return (
      <Table
        datas={datas}
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

  if (viewMode === ViewMode.TILE && visibleHeaders) {
    return (
      <div className="mx-5">
        <Tile
          datas={datas}
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

  if (viewMode === ViewMode.FORMATION) {
    const formationDatas = convertToFormationItem(datas.map((d) => d.item));

    return (
      <div className="mx-5 flex justify-center">
        <Formation datas={formationDatas} />
      </div>
    );
  }

  if (viewMode === ViewMode.CALENDAR && viewOptions?.calendar) {
    const { currentDate, setCurrentDate } = viewOptions.calendar;
    const calendarData = convertToCalendarData(datas.map((d) => d.item));

    return (
      <CalendarTable
        data={calendarData}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />
    );
  }
};

export default DataView;
