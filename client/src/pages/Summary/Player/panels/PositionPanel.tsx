import { ModelType } from "../../../../types/models";
import { UsePlayerSummary } from "../types";
import { DataViewContainer } from "../../../../components/dataView";
import { ViewMode } from "../../../../types/types";
import { UIFieldDefinition } from "../../../../types/field";
import { FormationItem } from "../../../../types/formation";
import { ColumnType } from "../../../../types/table";
import { convertToFormationItem } from "../../../../utils/data/convertToFormationItem";

const fieldDefinitions: UIFieldDefinition<FormationItem>[] = [
  {
    key: "position",
    field: "position",
    label: "ポジション",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
  },
  {
    key: "centerText",
    field: "centerText",
    label: "試合数",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
  },
  {
    key: "label",
    field: "label",
    label: "ラベル",
    type: "string",
    filterable: false,
    sortable: false,
    displayOnDetail: false,
    displayOnTable: false,
    getValueType: ColumnType.FIELD,
  },
  {
    key: "size",
    field: "size",
    label: "サイズ",
    type: "string",
    filterable: false,
    sortable: false,
    displayOnDetail: false,
    displayOnTable: false,
    getValueType: ColumnType.FIELD,
  },
  {
    key: "color",
    field: "color",
    label: "色",
    type: "Date",
    filterable: false,
    sortable: false,
    displayOnDetail: false,
    displayOnTable: false,
    getValueType: ColumnType.FIELD,
  },
];

const PositionPanel = ({ summary }: { summary: UsePlayerSummary }) => {
  const {
    panels: {
      position: { text, items, reloadFun, isLoading },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <DataViewContainer
        modelType={ModelType.PLAYER_APPEARANCE}
        fieldDefinitions={fieldDefinitions}
        totalCount={items.length}
        itemsLoading={isLoading}
        reloadFun={reloadFun}
        viewModes={[ViewMode.TABLE, ViewMode.TILE, ViewMode.FORMATION]}
        defaultViewMode={ViewMode.FORMATION}
        viewData={{
          [ViewMode.TABLE]: items,
          [ViewMode.TILE]: items,
          [ViewMode.FORMATION]: convertToFormationItem(items),
        }}
      />
    </>
  );
};

export default PositionPanel;
