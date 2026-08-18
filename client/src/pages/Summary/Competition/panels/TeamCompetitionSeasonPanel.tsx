import { ModelType } from "../../../../types/models";
import TableClient from "../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../types/field";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { UseCompetitionSummary } from "../types";
import { TeamCompetitionSeasonGet } from "../../../../types/models/team-competition-season";

const teamCompetitionSeasonFieldDefinition =
  convertFieldDefinition<TeamCompetitionSeasonGet>(
    ["team"],
    fieldDefinition[ModelType.TEAM_COMPETITION_SEASON],
  );

const TeamCompetitionSeasonPanel = ({
  summary,
}: {
  summary: UseCompetitionSummary;
}) => {
  const {
    id,
    panels: {
      teamCompetitionSeason: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  if (!summary.select) return;

  const { selectedOption } = summary.select;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        itemsLoading={isLoading}
        modelType={ModelType.TEAM_COMPETITION_SEASON}
        fieldDefinitions={teamCompetitionSeasonFieldDefinition}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        filterField={teamCompetitionSeasonFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "competition")}
        sortField={teamCompetitionSeasonFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "competition")}
        initialData={{
          formData: { season: selectedOption?._id },
          metaData: {
            competition: id,
          },
        }}
        linkField={[
          {
            field: "team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
      />
    </>
  );
};

export default TeamCompetitionSeasonPanel;
