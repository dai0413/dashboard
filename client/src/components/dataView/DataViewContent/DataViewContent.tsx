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
import { RadarValues } from "../../../utils/plot/buildRadarPlotData";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { PlayerRegistrationHistoryGet } from "../../../types/models/player-registration-history";
import { MatchGet } from "../../../types/models/match";
import { PlayerAppearanceGet } from "../../../types/models/player-appearance";
import { FormationCounts } from "../../../pages/Summary/Team/ClubTeam/types";
import { NationalCallup } from "../../../types/models/national-callup";
import { NationalMatchSeries } from "../../../types/models/national-match-series";

type Props<T> = {
  noItem?: boolean;
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
    [ViewMode.MATCH_MATRIX]?: {
      teamId: string;
      playerStatistics: PlayerStatistic[];
      playerRegistrations: PlayerRegistrationHistoryGet[];
      matches: MatchGet[];
      playerAppearance: PlayerAppearanceGet[];
      formationCounts: FormationCounts[];
    };
    [ViewMode.SERIES_MATRIX]?: {
      playerStatistics: PlayerStatistic[];
      nationalCallUp: NationalCallup[];
      nationalMatchSeries: NationalMatchSeries[];
      playerAppearance: PlayerAppearanceGet[];
      formationCounts: FormationCounts[];
      startBaseDate?: Date;
      endBaseDate?: Date;
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

  noItem,
  noItemMessage,
  pageButton,
  pages,
  pageNum,
  onPageChange,
  viewData,
}: Props<K>) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="bg-gray-50 px-8 py-10 text-center">
          <Loader2 className="animate-spin w-10 h-10 text-gray-600" />
        </div>
      </div>
    );
  }

  if (noItem) {
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
  }

  return (
    <div className="max-h-[50rem] overflow-y-auto">
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
      />
      {pageButton && (
        <PageButtons
          pages={pages}
          currentPageNum={pageNum}
          onClick={onPageChange}
        />
      )}
    </div>
  );
};
