import { ModelType } from "../../../../../types/models";
import { TableClient } from "../../../../../components/dataView";
import { convertFieldDefinition } from "../../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../../types/field";
import { APP_ROUTES } from "../../../../../lib/appRoutes";
import { UseClubTeamSummary } from "../types";

import { convert } from "../../../../../lib/convert/DBtoGetted";
import { TeamCompetitionSeasonGet } from "../../../../../types/models/team-competition-season";
import { ViewMode } from "../../../../../types/types";

const teamCompetitionSeasonFieldDefinition =
  convertFieldDefinition<TeamCompetitionSeasonGet>(
    ["season", "competition", "note"],
    fieldDefinition[ModelType.TEAM_COMPETITION_SEASON],
  );

const TeamCompetitionSeasonPanel = ({
  summary,
}: {
  summary: UseClubTeamSummary;
}) => {
  const {
    panels: {
      teamCompetitionSeason: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  const converted = convert(ModelType.TEAM_COMPETITION_SEASON, items);

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        itemsLoading={isLoading}
        modelType={ModelType.TEAM_COMPETITION_SEASON}
        fieldDefinitions={teamCompetitionSeasonFieldDefinition}
        viewModes={[ViewMode.TABLE, ViewMode.TILE]}
        viewData={{ [ViewMode.TABLE]: converted, [ViewMode.TILE]: converted }}
        totalCount={converted.length}
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
