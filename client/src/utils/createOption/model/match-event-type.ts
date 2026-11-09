import { OptionObj } from "../../../types/form/option";
import { MatchEventType } from "../../../types/models/match-event-type";
import { ColumnType } from "../../../types/table";
import { MatchEventTypeOption } from "../types/model/match-event-type";

export const matchEventType = (
  data: MatchEventType[],
): OptionObj<MatchEventTypeOption> => {
  const options: MatchEventTypeOption[] = data.map((d) => ({
    label: d.name,
    key: d._id,
    event_type: d.event_type,
  }));

  return {
    fields: [
      {
        label: "名前",
        field: "label",
        getValueType: ColumnType.FIELD,
        key: "label",
        displayOnTable: true,
        type: "string",
      },
      {
        label: "イベントタイプ",
        field: "event_type",
        getValueType: ColumnType.FIELD,
        key: "event_type",
        displayOnTable: true,
        type: "string",
      },
    ],
    data: options,
  };
};
