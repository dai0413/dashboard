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
import { MatchGet } from "../../../../types/models/match";

const matchFieldDefinition: UIFieldDefinition<
  GettedModelDataMap[ModelType.MATCH]
>[] = [
  ...convertFieldDefinition<MatchGet>(
    [
      "competition",
      "date",
      "match_week",
      "competition_stage",
      "home_team",
      "result-string",
      "away_team",
    ],
    fieldDefinition[ModelType.MATCH],
  ),
];

const MatchPanel = ({
  summary,
}: {
  summary: UseNationalMatchSeriesSummary;
}) => {
  const {
    panels: {
      match: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        itemsLoading={isLoading}
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
            field: "result-string",
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
