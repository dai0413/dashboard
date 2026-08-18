import { GettedModelDataMap, ModelType } from "../../../../types/models";
import TableClient from "../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../lib/model-fields";
import {
  isFilterable,
  isSortable,
  UIFieldDefinition,
} from "../../../../types/field";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { UseCompetitionSummary } from "../types";
import { MatchGet } from "../../../../types/models/match";

const matchFieldDefinition: UIFieldDefinition<
  GettedModelDataMap[ModelType.MATCH]
>[] = [
  ...convertFieldDefinition<MatchGet>(
    [
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

const MatchPanel = ({ summary }: { summary: UseCompetitionSummary }) => {
  const {
    id,
    panels: {
      match: { text, key, items, reloadFun },
    },
  } = summary;

  if (!summary.select) return;

  const { selectedOption } = summary.select;

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
        filterField={matchFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "competition")}
        sortField={matchFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "competition")}
        initialData={{
          metaData: {
            season: selectedOption?._id,
            competition: id,
          },
        }}
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
        ]}
      />
    </>
  );
};

export default MatchPanel;
