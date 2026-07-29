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
import { toDateKey } from "@dai0413/myorg-shared/normalizer";

const MatchPanel = ({ summary }: { summary: UseNationalTeamSummary }) => {
  const {
    id,
    match: { text, key, items, reloadFun },
  } = summary;

  const matchFieldDefinition: UIFieldDefinition<
    GettedModelDataMap[ModelType.MATCH]
  >[] = [
    ...convertFieldDefinition<ModelType.MATCH>(
      ["date", "competition", "competition_stage", "match_week"],
      fieldDefinition[ModelType.MATCH],
    ).filter((v) => !["result", "date"].includes(v.key)),
    {
      label: "開催日",
      key: "date",
      getData: (d: MatchGet) => toDateKey(d.date, true) || "",
      getValueType: ColumnType.CUSTOM,
      displayOnTable: true,
      type: "Date",
    },
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
    {
      label: "結果",
      key: "result",
      displayOnTable: true,
      getData: (d: MatchGet) => {
        const isHome = d.home_team.id === id;
        const goal = isHome ? d.home_goal : d.away_goal;
        const againstGoal = isHome ? d.away_goal : d.home_goal;
        const pkGoal = isHome ? d.home_pk_goal : d.away_pk_goal;
        const againstPkGoal = isHome ? d.away_pk_goal : d.home_pk_goal;

        const score =
          goal !== undefined && againstGoal !== undefined
            ? `${goal}-${againstGoal}`
            : "";

        const pk =
          pkGoal !== undefined && againstPkGoal !== undefined
            ? `(${pkGoal}PK${againstPkGoal})`
            : "";

        return score + pk;
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
          { field: "result", to: APP_ROUTES.MATCH_SUMMARY },
        ]}
      />
    </>
  );
};

export default MatchPanel;
