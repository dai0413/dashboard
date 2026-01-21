import { OptionArray, OptionTable } from "../../../types/option";
import { MatchEventTypeGet } from "../../../types/models/match-event-type";

export const matchEventType = (
  data: MatchEventTypeGet[],
  table: boolean,
): OptionArray | OptionTable => {
  const options = data.map((d) => ({
    label: d.name,
    key: d._id,
    event_type: d.event_type,
  }));

  if (table === true) {
    return {
      header: [
        { label: "名前", field: "label" },
        { label: "イベントタイプ", field: "event_type" },
      ],
      data: options,
    };
  }

  return options;
};
