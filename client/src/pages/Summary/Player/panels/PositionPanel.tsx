import { ModelType } from "../../../../types/models";
import { UsePlayerSummary } from "../types";
import { CustomTableContainer } from "../../../../components/table";
import { Formation } from "../../../../components/formation";

const PositionPanel = ({ summary }: { summary: UsePlayerSummary }) => {
  const {
    panels: {
      position: { text, items, reloadFun, isLoading },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <CustomTableContainer
        modelType={ModelType.PLAYER_APPEARANCE}
        fieldDefinitions={[]}
        pageNum={1}
        items={items}
        itemsLoading={isLoading}
        reloadFun={reloadFun}
        initialData={{
          formData: {},
          metaData: {},
        }}
        renderView={() => <Formation datas={items} />}
      />
    </>
  );
};

export default PositionPanel;
