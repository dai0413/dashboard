import { GettedModelDataMap, ModelType } from "../../../../types/models";
import TableClient from "../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../lib/model-fields";
import {
  isFilterable,
  isSortable,
  UIFieldDefinition,
} from "../../../../types/field";
import { UseNationalMatchSeriesSummary } from "../types";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { ColumnType } from "../../../../types/table";
import { MatchGet } from "../../../../types/models/match";

const matchFieldDefinition: UIFieldDefinition<
  GettedModelDataMap[ModelType.MATCH]
>[] = [
  ...convertFieldDefinition<ModelType.MATCH>(
    [
      "competition",
      "date",
      "match_week",
      "competition_stage",
      "home_team",
      "result",
      "away_team",
    ],
    fieldDefinition[ModelType.MATCH],
  ).filter((v) => !["result"].includes(v.key)),
  {
    label: "結果",
    getValueType: ColumnType.CUSTOM,
    key: "result",
    displayOnTable: true,
    getData: (d: MatchGet) => {
      // ゴール数がある場合
      const score =
        d.home_goal !== undefined && d.away_goal !== undefined
          ? `${d.home_goal}-${d.away_goal}`
          : "";

      // PKがある場合
      const pk =
        d.home_pk_goal !== undefined && d.away_pk_goal !== undefined
          ? `(${d.home_pk_goal}PK${d.away_pk_goal})`
          : "";

      return score + pk;
    },
    type: "string",
  },
];

const MatchPanel = ({
  summary,
}: {
  summary: UseNationalMatchSeriesSummary;
}) => {
  const {
    panels: {
      match: { text, key, items, reloadFun },
    },
  } = summary;

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
          {
            field: "home_team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
          {
            field: "away_team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
          {
            field: "result",
            to: APP_ROUTES.MATCH_SUMMARY,
          },
          {
            field: "competition",
            to: APP_ROUTES.COMPETITION_SUMMARY,
          },
        ]}
      />
    </>
  );
};

export default MatchPanel;
