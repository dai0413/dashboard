import { ModelType } from "../../../../../types/models";
import TableClient from "../../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../../types/field";
import { APP_ROUTES } from "../../../../../lib/appRoutes";
import { UseClubTeamSummary } from "../types";

import { convert } from "../../../../../lib/convert/DBtoGetted";

const teamCompetitionSeasonFieldDefinition =
  convertFieldDefinition<ModelType.TEAM_COMPETITION_SEASON>(
    ["season", "competition", "note"],
    fieldDefinition[ModelType.TEAM_COMPETITION_SEASON],
  );

const TeamCompetitionSeasonPanel = ({
  summary,
}: {
  summary: UseClubTeamSummary;
}) => {
  const {
    teamCompetitionSeason: { text, key, items, reloadFun },
  } = summary;

  const converted = convert(ModelType.TEAM_COMPETITION_SEASON, items);

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        modelType={ModelType.TEAM_COMPETITION_SEASON}
        fieldDefinitions={teamCompetitionSeasonFieldDefinition}
        pageNum={1}
        items={converted}
        reloadFun={reloadFun}
        filterField={teamCompetitionSeasonFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "team")}
        sortField={teamCompetitionSeasonFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "team")}
        linkField={[
          {
            field: "competition",
            to: APP_ROUTES.COMPETITION_SUMMARY,
          },
        ]}
      />
    </>
  );
};

export default TeamCompetitionSeasonPanel;
