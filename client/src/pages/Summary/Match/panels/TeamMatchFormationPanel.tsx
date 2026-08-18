import { ModelType } from "../../../../types/models";
import TableClient from "../../../../components/table/TableClient";
import { isFilterable, isSortable } from "../../../../types/field";
import { UseMatchSummary } from "../types";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../lib/model-fields";
import { TeamMatchFormationGet } from "../../../../types/models/team-match-formation";

const teamMatchFormationFieldDefinition =
  convertFieldDefinition<TeamMatchFormationGet>(
    ["team", "formation"],
    fieldDefinition[ModelType.TEAM_MATCH_FORMATION],
  );

const TeamMatchFormationPanel = ({ summary }: { summary: UseMatchSummary }) => {
  const {
    id,
    selected,
    panels: {
      teamMatchFormation: { text, key, items, reloadFun },
    },
  } = summary;

  if (!selected) return;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        modelType={ModelType.TEAM_MATCH_FORMATION}
        fieldDefinitions={teamMatchFormationFieldDefinition}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        filterField={teamMatchFormationFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "match")}
        sortField={teamMatchFormationFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "match")}
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

export default TeamMatchFormationPanel;
