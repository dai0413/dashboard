import { ModelType } from "../../../../types/models";
import TableClient from "../../../../components/table/TableClient";
import { isFilterable, isSortable } from "../../../../types/field";
import { UseMatchSummary } from "../types";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { statsLFieldDefinition } from "../constants/field";

const HomeStatsLPanel = ({ summary }: { summary: UseMatchSummary }) => {
  const {
    id,
    selected,
    panels: {
      homeStatsL: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  if (!selected) return;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        itemsLoading={isLoading}
        modelType={ModelType.STATS_L}
        fieldDefinitions={statsLFieldDefinition}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        filterField={statsLFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "match" && file.key !== "team")}
        sortField={statsLFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "match" && file.key !== "team")}
        linkField={[
          {
            field: "team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
        initialData={{
          formData: {
            match: id,
          },
          metaData: {
            match: [id],
            urls: selected.urls,
            competition_stage: selected.competition_stage.id,
          },
        }}
      />
    </>
  );
};

export default HomeStatsLPanel;
