import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TableWithFetch } from "../../components/table";
import { useCountry } from "../../context/models/country";
import { ModelType } from "../../types/models";
import { NationalTabItems } from "../../constants/menuItems";
import { IconButton } from "../../components/buttons";
import { SelectField } from "../../components/field";
import { OptionArray } from "../../types/form/option";
import { FullScreenLoader } from "../../components/ui";
import { fieldDefinition } from "../../lib/model-fields";
import { isFilterable, isSortable } from "../../types/field";
import { API_PATHS } from "@dai0413/myorg-shared";
import { APP_ROUTES } from "../../lib/appRoutes";
import { useModal } from "../../context/modal-context";
import { ColumnType } from "../../types/table";

const Tabs = NationalTabItems.filter(
  (item) =>
    item.icon && item.text && !item.className?.includes("cursor-not-allowed"),
).map((item) => ({
  key: item.icon as string,
  label: item.text as string,
})) as OptionArray;

const National = () => {
  const { id } = useParams();
  const {
    form: { isOpen: formIsOpen },
  } = useModal();

  const [selectedTab, setSelectedTab] = useState("competition");

  const {
    metacrud: { selected, readItem, isLoading },
  } = useCountry();

  useEffect(() => {
    if (!id) return;
    (async () => {
      await readItem(id);
    })();
  }, [id, formIsOpen]);

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as string);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header情報 */}
      {!isLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div className="font-bold text-lg">{selected.name}</div>
            <div className="text-gray-600">{selected.en_name}</div>
            <div className="text-sm text-gray-500">{selected.area}</div>
          </div>
        </div>
      ) : (
        <FullScreenLoader />
      )}

      {/* タブメニュー */}
      <div className="mb-4 pb-2">
        {/* SP: select */}
        <div className="mt-4 block sm:hidden">
          <SelectField
            type="text"
            value={selectedTab}
            options={Tabs}
            onChange={handleSelectedTab}
          />
        </div>

        {/* PC: tabs */}
        <div className="hidden sm:flex gap-4 border-b border-gray-700">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
            {NationalTabItems.map(({ icon, text, className }) => {
              const isActive = selectedTab === icon;
              return (
                <li key={text}>
                  <IconButton
                    icon={icon}
                    text={text}
                    color={isActive ? "green" : "gray"}
                    onClick={() => icon && handleSelectedTab(icon)}
                    direction="horizontal"
                    className={`
                        px-4 py-2 border-b-2 
                        ${
                          isActive
                            ? "border-green-500 text-green-700 font-semibold"
                            : "border-transparent hover:border-gray-300"
                        }
                        ${className}
                    `}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* コンテンツ表示 */}
      {selectedTab === "competition" && id && (
        <TableWithFetch
          modelType={ModelType.COMPETITION}
          fieldDefinitions={[
            {
              label: "大会名",
              field: "name",
              getValueType: ColumnType.FIELD,
              key: "name",
              displayOnTable: true,
              type: "string",
            },
            {
              label: "大会規模",
              field: "competition_type",
              width: "90px",
              getValueType: ColumnType.FIELD,
              key: "competition_type",
              displayOnTable: true,
              type: "select",
            },
            {
              label: "大会タイプ",
              field: "category",
              width: "100px",
              getValueType: ColumnType.FIELD,
              key: "category",
              displayOnTable: true,
              type: "select",
            },
            {
              label: "年代",
              field: "age_group",
              width: "70px",
              getValueType: ColumnType.FIELD,
              key: "age_group",
              displayOnTable: true,
              type: "select",
            },
          ]}
          fetch={{
            apiRoute: API_PATHS.COMPETITION.ROOT,
            params: { getAll: true, country: id, sort: "_id" },
          }}
          filterField={fieldDefinition[ModelType.COMPETITION]
            ?.filter(isFilterable)
            .filter((file) => file.key !== "country")}
          sortField={fieldDefinition[ModelType.COMPETITION]
            ?.filter(isSortable)
            .filter((file) => file.key !== "country")}
          linkField={[
            {
              field: "name",
              to: APP_ROUTES.COMPETITION_SUMMARY,
            },
          ]}
          initialData={{
            formData: {
              country: id,
            },
          }}
        />
      )}

      {selectedTab === "series" && id && (
        <TableWithFetch
          modelType={ModelType.NATIONAL_MATCH_SERIES}
          fieldDefinitions={[
            {
              label: "名称",
              field: "name",
              width: "250px",
              getValueType: ColumnType.FIELD,
              key: "name",
              displayOnTable: true,
              type: "string",
            },
            {
              label: "年代",
              field: "age_group",
              width: "100px",
              getValueType: ColumnType.FIELD,
              key: "age_group",
              displayOnTable: true,
              type: "select",
            },
            {
              label: "招集日",
              field: "joined_at",
              getValueType: ColumnType.FIELD,
              key: "joined_at",
              displayOnTable: true,
              type: "Date",
            },
            {
              label: "解散日",
              field: "left_at",
              getValueType: ColumnType.FIELD,
              key: "left_at",
              displayOnTable: true,
              type: "Date",
            },
          ]}
          fetch={{
            apiRoute: API_PATHS.NATIONAL_MATCH_SERIES.ROOT,
            params: { getAll: true, country: id, sort: "-_id" },
          }}
          filterField={fieldDefinition[ModelType.NATIONAL_MATCH_SERIES]
            ?.filter(isFilterable)
            .filter((file) => file.key !== "country")}
          sortField={fieldDefinition[ModelType.NATIONAL_MATCH_SERIES]
            ?.filter(isSortable)
            .filter((file) => file.key !== "country")}
          linkField={[
            {
              field: "name",
              to: APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY,
            },
          ]}
          initialData={{
            formData: {
              country: id,
            },
          }}
        />
      )}

      {selectedTab === "player" && id && (
        <TableWithFetch
          modelType={ModelType.NATIONAL_CALLUP}
          fieldDefinitions={[
            {
              label: "代表試合シリーズ",
              field: "series",
              width: "250px",
              getValueType: ColumnType.FIELD,
              key: "series",
              displayOnTable: true,
              type: "string",
            },
            {
              label: "選手",
              field: "player",
              isPrimary: true,
              getValueType: ColumnType.FIELD,
              key: "player",
              displayOnTable: true,
              type: "string",
            },
            {
              label: "招集状況",
              field: "status",
              width: "100px",
              getValueType: ColumnType.FIELD,
              key: "status",
              displayOnTable: true,
              type: "select",
            },
            {
              label: "背番号",
              field: "number",
              width: "100px",
              getValueType: ColumnType.FIELD,
              key: "number",
              displayOnTable: true,
              type: "number",
            },
            {
              label: "ポジション",
              field: "position_group",
              width: "100px",
              getValueType: ColumnType.FIELD,
              key: "position_group",
              displayOnTable: true,
              type: "select",
            },
          ]}
          fetch={{
            apiRoute: API_PATHS.NATIONAL_CALLUP.ROOT,
            params: {
              getAll: true,
              "series.country": id,
              sort: "-series,position_group_order,number",
            },
          }}
          filterField={fieldDefinition[ModelType.NATIONAL_CALLUP]?.filter(
            isFilterable,
          )}
          sortField={fieldDefinition[ModelType.NATIONAL_CALLUP]?.filter(
            isSortable,
          )}
          linkField={[
            {
              field: "series",
              to: APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY,
            },
            {
              field: "player",
              to: APP_ROUTES.PLAYER_SUMMARY,
            },
          ]}
        />
      )}
    </div>
  );
};

export default National;
