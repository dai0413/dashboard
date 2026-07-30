import { ModelType } from "../../../../types/models";
import TableClient from "../../../../components/table/TableClient";
import { fieldDefinition } from "../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../types/field";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { UseCompetitionSummary } from "../types";

const MatchPanel = ({ summary }: { summary: UseCompetitionSummary }) => {
  const {
    id,
    panels: {
      statsL: { text, key, items, reloadFun },
    },
  } = summary;

  if (!summary.select) return;

  const { selectedOption } = summary.select;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        modelType={ModelType.STATS_L}
        fieldDefinitions={fieldDefinition[ModelType.STATS_L] || []}
        pageNum={1}
        items={items.raw}
        reloadFun={reloadFun}
        filterField={fieldDefinition[ModelType.STATS_L]
          ?.filter(isFilterable)
          .filter((file) => file.key !== "competition")}
        sortField={fieldDefinition[ModelType.STATS_L]
          ?.filter(isSortable)
          .filter((file) => file.key !== "competition")}
        initialData={{
          metaData: {
            season: selectedOption?._id,
            competition: id,
          },
        }}
        linkField={[
          {
            field: "match",
            to: APP_ROUTES.MATCH_SUMMARY,
          },
        ]}
      />
    </>
  );
};

export default MatchPanel;
