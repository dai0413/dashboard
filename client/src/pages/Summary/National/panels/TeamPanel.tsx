import { ModelType } from "../../../../types/models";
import TableClient from "../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../types/field";
import { UseNationalSummary } from "../types";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { TeamGet } from "../../../../types/models/team";

const teamFieldDefinition = convertFieldDefinition<TeamGet>(
  ["normalized_name", "abbr", "enTeam", "country", "age_group"],
  fieldDefinition[ModelType.TEAM],
);

const TeamPanel = ({ summary }: { summary: UseNationalSummary }) => {
  const {
    panels: {
      team: { text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        modelType={ModelType.TEAM}
        fieldDefinitions={teamFieldDefinition}
        pageNum={1}
        items={items}
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
