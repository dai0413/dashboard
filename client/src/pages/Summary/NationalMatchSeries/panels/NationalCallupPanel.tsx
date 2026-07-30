import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { ModelType } from "../../../../types/models";
import TableClient from "../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../types/field";
import { UseNationalMatchSeriesSummary } from "../types";
import { APP_ROUTES } from "../../../../lib/appRoutes";

const nationalCallupFieldDefinition =
  convertFieldDefinition<ModelType.NATIONAL_CALLUP>(
    ["player", "team", "status", "number", "position_group"],
    fieldDefinition[ModelType.NATIONAL_CALLUP],
  );

const NationalCallupPanel = ({
  summary,
}: {
  summary: UseNationalMatchSeriesSummary;
}) => {
  const {
    id,
    selected,
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
          .filter((file) => file.key !== "series")}
        sortField={nationalCallupFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "series")}
        linkField={[
          {
            field: "team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
        ]}
        initialData={{
          formData: {
            series: id,
            joined_at: selected?.joined_at
              ? toDateKey(selected?.joined_at)
              : undefined,
            left_at: selected?.left_at
              ? toDateKey(selected?.left_at)
              : undefined,
          },
          metaData: {
            series: id,
          },
        }}
      />
    </>
  );
};

export default NationalCallupPanel;
