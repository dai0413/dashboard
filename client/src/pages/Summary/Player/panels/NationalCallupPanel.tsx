import { ModelType } from "../../../../types/models";
import TableClient from "../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../types/field";
import { UsePlayerSummary } from "../types";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { NationalCallupGet } from "../../../../types/models/national-callup";

const nationalCallupFieldDefinition = convertFieldDefinition<NationalCallupGet>(
  ["series", "status", "number", "joined_at"],
  fieldDefinition[ModelType.NATIONAL_CALLUP],
);

const NationalCallupPanel = ({ summary }: { summary: UsePlayerSummary }) => {
  const {
    id,
    panels: {
      nationalCallup: { text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        modelType={ModelType.NATIONAL_CALLUP}
        fieldDefinitions={nationalCallupFieldDefinition}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        filterField={nationalCallupFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "player")}
        sortField={nationalCallupFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "player")}
        linkField={[
          {
            field: "series",
            to: APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY,
          },
        ]}
        initialData={{ formData: { player: id } }}
      />
    </>
  );
};

export default NationalCallupPanel;
