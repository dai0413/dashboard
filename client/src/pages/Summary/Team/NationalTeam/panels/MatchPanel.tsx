import { GettedModelDataMap, ModelType } from "../../../../../types/models";
import TableClient from "../../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../../lib/model-fields";
import {
  isFilterable,
  isSortable,
  UIFieldDefinition,
} from "../../../../../types/field";
import { APP_ROUTES } from "../../../../../lib/appRoutes";
import { UseNationalTeamSummary } from "../types";
import { MatchGet } from "../../../../../types/models/match";
import { ColumnType } from "../../../../../types/table";

const MatchPanel = ({ summary }: { summary: UseNationalTeamSummary }) => {
  const {
    id,
    panels: {
      match: { text, key, items, reloadFun },
    },
  } = summary;

  const matchFieldDefinition: UIFieldDefinition<
    GettedModelDataMap[ModelType.MATCH]
  >[] = [
    ...convertFieldDefinition<ModelType.MATCH>(
      [
        "date",
        "competition",
        "competition_stage",
        "match_week",
        "result-string",
      ],
      fieldDefinition[ModelType.MATCH],
    ),
    {
      label: "相手",
      key: "vsTeam",
      displayOnTable: true,
      getData: (d: MatchGet) => {
        const isHome = d.home_team.id === id;
        const vsTeam = isHome ? d.away_team : d.home_team;

        return vsTeam;
      },
      getValueType: ColumnType.CUSTOM,
      type: "string",
    },
  ];

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        modelType={ModelType.MATCH}
        fieldDefinitions={matchFieldDefinition}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        filterField={matchFieldDefinition?.filter(isFilterable)}
        sortField={matchFieldDefinition?.filter(isSortable)}
        linkField={[
          { field: "competition", to: APP_ROUTES.COMPETITION_SUMMARY },
          { field: "vsTeam", to: APP_ROUTES.TEAM_SUMMARY },
          { field: "result-string", to: APP_ROUTES.MATCH_SUMMARY },
        ]}
      />
    </>
  );
};

export default MatchPanel;
