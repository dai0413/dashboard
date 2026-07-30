import { ModelType } from "../../../../types/models";
import TableClient from "../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../types/field";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { UseCompetitionSummary } from "../types";

const teamCompetitionSeasonFieldDefinition =
  convertFieldDefinition<ModelType.TEAM_COMPETITION_SEASON>(
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
    select: { selectedOption },
    panels: {
      teamCompetitionSeason: { text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
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
