import { Loader2 } from "lucide-react";
import DataView from "./DataView/DataView";
import { PageButtons } from "../PageButtons";
import { TableData, TableHeader } from "../../../types/table";
import { ModelType } from "../../../types/models";
import { LinkField, ViewMode } from "../../../types/types";
import { UIFieldDefinition } from "../../../types/field";
import { ReactNode } from "react";
import { RadarField } from "../../plot/RadarChart/types";
import { FormationItem } from "../../../types/formation";
import { CalendarDataItem } from "./DataView/Calendar/types";
import { StatsActual } from "../../../pages/Summary/Competition/types";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player";
import { MatchGet } from "../../../types/models/match";
import { PlayerAppearanceGet } from "../../../types/models/player-appearance";
import { FormationCounts } from "../../../pages/Summary/Team/ClubTeam/types";
import { NationalCallup } from "../../../types/models/national-callup";
import { NationalMatchSeries } from "../../../types/models/national-match-series";
import { PlayerRegistrationGet } from "../../../types/models/player-registration";
import { useDataView } from "../../../context/dataView-context";
import { GroupedPlayers } from "./DataView/Matrix/type";
import { TransferGet } from "../../../types/models/transfer";
import {
  MonthlyCalendarGroup,
  MonthleyCalendarHeaderItem,
} from "../../../types/calendar";
import { InjuryGet } from "../../../types/models/injury";

type Props<T> = {
  isLoading?: boolean;

  modelType?: ModelType;
  linkField?: LinkField[];
  fieldDefinitions?: UIFieldDefinition<T>[];

  /** 単一データ編集モード */
  form?: boolean;
  onActionClick?: (index: number, row: T) => void;
  selectedKey?: string[];

  /** 複数データ編集モード */
  edit?: boolean;
  renderFieldCell?: (
    header: TableHeader<T>,
    row: T,
    rowIndex: number,
  ) => React.ReactNode;
  deleteOnClick?: (index: number) => void;
  selectedKeys?: Record<number, string[]>;

  // レンダリング
  noItemMessage?: ReactNode;

  pageButton?: boolean;
  pages: (number | "...")[];
  pageNum: number;
  onPageChange: (page: number) => void;
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
      data: StatsActual;
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
      injuries: InjuryGet[];
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

export const DataViewContent = <K extends Record<string, unknown>>({
  modelType,
  linkField,
  fieldDefinitions,
  isLoading,

  form,
  onActionClick,
  selectedKey,

  edit,
  renderFieldCell,
  deleteOnClick,
  selectedKeys,

  noItemMessage,
  pageButton,
  pages,
  pageNum,
  onPageChange,
  viewData,
}: Props<K>) => {
  const { viewMode } = useDataView();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="bg-gray-50 px-8 py-10 text-center">
          <Loader2 className="animate-spin w-10 h-10 text-gray-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <DataView<K>
        modelType={modelType}
        headers={fieldDefinitions}
        linkField={linkField}
        form={form}
        onActionClick={onActionClick}
        selectedKey={selectedKey}
        renderFieldCell={renderFieldCell}
        edit={edit}
        selectedKeys={selectedKeys}
        onDeleteClick={deleteOnClick}
        viewData={viewData}
        noItemMessage={noItemMessage}
      />

      {(viewMode === ViewMode.TABLE || viewMode === ViewMode.TILE) &&
        pageButton && (
          <PageButtons
            pages={pages}
            currentPageNum={pageNum}
            onClick={onPageChange}
          />
        )}
    </div>
  );
};
