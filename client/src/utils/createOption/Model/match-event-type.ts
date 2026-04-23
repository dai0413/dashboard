import { OptionArray, OptionTable } from "../../../types/option";
import { MatchEventTypeGet } from "../../../types/models/match-event-type";
import { ColumnType } from "../../../types/table";
import { MatchEventType } from "../types/optionTable/match-event-type";

export const matchEventType = (
  data: MatchEventTypeGet[],
  table: boolean,
): OptionArray | OptionTable<MatchEventType> => {
  const options: MatchEventType[] = data.map((d) => ({
    label: d.name,
    key: d._id,
    event_type: d.event_type,
  }));

  if (table === true) {
    return {
      header: [
        {
          label: "名前",
          field: "label",
          type: ColumnType.FIELD,
          id: "label",
          defaultDisplay: true,
        },
        {
          label: "イベントタイプ",
          field: "event_type",
          type: ColumnType.FIELD,
          id: "event_type",
          defaultDisplay: true,
        },
      ],
      data: options,
    };
  }

  return options;
};
