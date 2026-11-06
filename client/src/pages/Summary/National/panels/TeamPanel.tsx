import { ModelType } from "../../../../types/models";
import { TableClient } from "../../../../components/dataView";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { isFilterable, isSortable } from "../../../../types/field";
import { UseNationalSummary } from "../types";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { ViewMode } from "../../../../types/types";

const teamFieldDefinition = convertFieldDefinition({
  keys: ["normalized_name", "abbr", "enTeam", "country", "age_group"],
  getFieldsKey: ModelType.TEAM,
});

const TeamPanel = ({ summary }: { summary: UseNationalSummary }) => {
  const {
    panels: {
      team: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <h2 className="text-base font-semibold text-gray-800">{text}</h2>
      <TableClient
        key={key}
        itemsLoading={isLoading}
        modelType={ModelType.TEAM}
        fieldDefinitions={teamFieldDefinition}
        viewModes={[ViewMode.TABLE, ViewMode.TILE]}
        viewData={{ [ViewMode.TABLE]: items, [ViewMode.TILE]: items }}
        totalCount={items.length}
        reloadFun={reloadFun}
        filterField={teamFieldDefinition?.filter(isFilterable)}
        sortField={teamFieldDefinition?.filter(isSortable)}
        linkField={[
          {
            field: "normalized_name",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
      />
    </>
  );
};

export default TeamPanel;
