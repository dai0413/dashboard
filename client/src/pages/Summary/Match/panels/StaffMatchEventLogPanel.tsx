import { ModelType } from "../../../../types/models";
import TableClient from "../../../../components/table/TableClient";
import { isFilterable, isSortable } from "../../../../types/field";
import { UseMatchSummary } from "../types";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../lib/model-fields";
import { StaffMatchEventLogGet } from "../../../../types/models/staff-match-event-log";

const staffEventLogFieldDefinition =
  convertFieldDefinition<StaffMatchEventLogGet>(
    [
      "period_label",
      "time_name",
      "special_time",
      "team",
      "match_event_type",
      "staff",
    ],
    fieldDefinition[ModelType.STAFF_MATCH_EVENT_LOG],
  );

const StaffMatchEventLogPanel = ({ summary }: { summary: UseMatchSummary }) => {
  const {
    id,
    selected,
    panels: {
      staffMatchEventLog: { text, key, items, reloadFun },
    },
  } = summary;

  if (!selected) return;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        modelType={ModelType.STAFF_MATCH_EVENT_LOG}
        fieldDefinitions={staffEventLogFieldDefinition}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        filterField={staffEventLogFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "match")}
        sortField={staffEventLogFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "match")}
        linkField={[
          {
            field: "staff",
            to: APP_ROUTES.STAFF_SUMMARY,
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

export default StaffMatchEventLogPanel;
