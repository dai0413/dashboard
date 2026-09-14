import { ModelType } from "../../../../types/models";
import { UsePlayerSummary } from "../types";
import { DataViewContainer } from "../../../../components/dataView";
import { Formation } from "../../../../components/formation";
import { ViewMode } from "../../../../types/types";

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
        fieldDefinitions={[]}
        items={items}
        totalCount={items.length}
        itemsLoading={isLoading}
        reloadFun={reloadFun}
        initialData={{
          formData: {},
          metaData: {},
        }}
        renderView={() => <Formation datas={items} />}
        viewModes={[ViewMode.TABLE, ViewMode.TILE, ViewMode.FORMATION]}
        defaultViewMode={ViewMode.FORMATION}
      />
    </>
  );
};

export default PositionPanel;
