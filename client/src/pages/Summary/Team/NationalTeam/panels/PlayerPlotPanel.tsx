import { ModelType } from "../../../../../types/models";
import { fieldDefinition } from "../../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../../types/field";
import { UseNationalTeamSummary } from "../types";
import { CustomTableContainer } from "../../../../../components/table";
import Matrix from "../../../../../components/table/Matrix";

const PlayerPlotPanel = ({ summary }: { summary: UseNationalTeamSummary }) => {
  const {
    panels: {
      playerPlot: { text, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <CustomTableContainer
        fieldDefinitions={[]}
        pageNum={1}
        items={items.nationalCallUp}
        noToolBar={false}
        filterField={fieldDefinition[ModelType.NATIONAL_MATCH_SERIES]?.filter(
          isFilterable,
        )}
        sortField={fieldDefinition[ModelType.NATIONAL_MATCH_SERIES]?.filter(
          isSortable,
        )}
        reloadFun={reloadFun}
        renderView={() => (
          <Matrix
            nationalCallUp={items.nationalCallUp}
            nationalMatchSeries={items.nationalMatchSeries}
            playerAppearance={items.playerAppearance}
          />
        )}
      />
    </>
  );
};

export default PlayerPlotPanel;
