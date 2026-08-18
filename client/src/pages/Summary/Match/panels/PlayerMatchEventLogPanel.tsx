import { ModelType } from "../../../../types/models";
import TableClient from "../../../../components/table/TableClient";
import { isFilterable, isSortable } from "../../../../types/field";
import { UseMatchSummary } from "../types";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../lib/model-fields";
import { PlayerMatchEventLogGet } from "../../../../types/models/player-match-event-log";

const playerEventLogFieldDefinition =
  convertFieldDefinition<PlayerMatchEventLogGet>(
    [
      "period_label",
      "time_name",
      "special_time",
      "team",
      "match_event_type",
      "player",
    ],
    fieldDefinition[ModelType.PLAYER_MATCH_EVENT_LOG],
  );

const PlayerMatchEventLogPanel = ({
  summary,
}: {
  summary: UseMatchSummary;
}) => {
  const {
    id,
    selected,
    panels: {
      playerMatchEventLog: { text, key, items, reloadFun },
    },
  } = summary;

  if (!selected) return;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        modelType={ModelType.PLAYER_MATCH_EVENT_LOG}
        fieldDefinitions={playerEventLogFieldDefinition}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        filterField={playerEventLogFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "match")}
        sortField={playerEventLogFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "match")}
        linkField={[
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
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

export default PlayerMatchEventLogPanel;
