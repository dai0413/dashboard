import { UIFieldDefinition } from "../../../../types/field";
import { getDataFields } from "../../../../utils/data-field";
import { ModelType } from "../../../../types/models";
import { StatsActual } from "../types";

const defaultFields = ["xgFor", "xgAgainst"];

export const statsFields: UIFieldDefinition<StatsActual>[] =
  getDataFields(ModelType.STATS_L)
    ?.filter(
      (field): field is UIFieldDefinition<StatsActual> => field.key !== "match",
    )
    .map((f) => {
      if (defaultFields.includes(f.key)) {
        return { ...f, displayOnTable: true };
      }

      return f;
    }) || [];
